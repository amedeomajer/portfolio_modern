'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { GalleryItem } from '@/types/gallery';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

function formatDate(dateStr: string): string {
  // Handle both ISO strings and raw EXIF format "YYYY:MM:DD HH:MM:SS"
  const normalized = /^\d{4}:\d{2}:\d{2}/.test(dateStr)
    ? dateStr.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3')
    : dateStr;
  const date = new Date(normalized);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

interface LightboxProps {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const CLOSE_ANIMATION_MS = 200;
const SWIPE_THRESHOLD_PX = 60;
const CLOSE_DRAG_THRESHOLD_PX = 100;

function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const item = items[index];
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const dragDelta = useRef({ x: 0, y: 0 }); // live values; state would be stale in pointer handlers
  const dragAxis = useRef<'x' | 'y' | null>(null); // locked once the dominant axis is clear
  const didDrag = useRef(false); // suppress the click-close that follows a drag release
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [closing, setClosing] = useState(false);

  // Animate out before actually unmounting; guard against double-trigger
  // (close button click also bubbles to the backdrop onClick)
  const requestClose = useCallback(() => {
    if (closeTimeout.current !== null) return;
    setClosing(true);
    closeTimeout.current = setTimeout(onClose, CLOSE_ANIMATION_MS);
  }, [onClose]);

  // Cancel pending close on unmount so a fast reopen isn't killed by a stale timer
  useEffect(() => {
    return () => {
      if (closeTimeout.current !== null) clearTimeout(closeTimeout.current);
    };
  }, []);

  const goPrev = useCallback(() => {
    onNavigate((index - 1 + items.length) % items.length);
  }, [index, items.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((index + 1) % items.length);
  }, [index, items.length, onNavigate]);

  // Keyboard navigation + focus trap (Tab cycles within the dialog)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();

      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [requestClose, goPrev, goNext]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Focus management: move focus into the lightbox, restore on close
  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => previouslyFocused.current?.focus();
  }, []);

  // Preload neighbors for instant navigation
  useEffect(() => {
    [items[(index + 1) % items.length], items[(index - 1 + items.length) % items.length]].forEach(
      (neighbor) => {
        if (neighbor) prefetchImage(neighbor.imageUrl);
      }
    );
  }, [index, items]);

  // Drag handling: horizontal swipe navigates, pulling down closes
  const onPointerDown = (e: React.PointerEvent) => {
    // Don't start a drag from interactive controls (arrows, close button)
    if ((e.target as HTMLElement).closest('button')) return;
    dragStart.current = { x: e.clientX, y: e.clientY };
    dragDelta.current = { x: 0, y: 0 };
    dragAxis.current = null;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const delta = {
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    };
    dragDelta.current = delta;

    // Lock onto an axis once movement is unambiguous
    if (!dragAxis.current && (Math.abs(delta.x) > 10 || Math.abs(delta.y) > 10)) {
      dragAxis.current = Math.abs(delta.x) >= Math.abs(delta.y) ? 'x' : 'y';
    }
    if (Math.abs(delta.x) > 5 || Math.abs(delta.y) > 5) didDrag.current = true;

    if (dragAxis.current === 'y') {
      // Downward pull only; upward does nothing
      setDragOffset({ x: 0, y: Math.max(0, delta.y) });
    } else {
      setDragOffset({ x: delta.x, y: 0 });
    }
  };

  const onPointerUp = () => {
    if (!dragStart.current) return;
    const delta = dragDelta.current;
    const axis = dragAxis.current;
    dragStart.current = null;
    dragDelta.current = { x: 0, y: 0 };
    dragAxis.current = null;
    setDragOffset({ x: 0, y: 0 });

    if (axis === 'y' && delta.y > CLOSE_DRAG_THRESHOLD_PX) {
      requestClose();
    } else if (axis === 'x' && Math.abs(delta.x) > SWIPE_THRESHOLD_PX) {
      if (delta.x > 0) goPrev();
      else goNext();
    }
  };

  if (!item) return null;

  // Backdrop click closes — but not if it was the tail end of a drag
  const onBackdropClick = () => {
    if (didDrag.current) {
      didDrag.current = false;
      return;
    }
    requestClose();
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={item?.title ? `Photo: ${item.title}` : `Photo ${index + 1} of ${items.length}`}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center select-none touch-none"
      style={{
        animation: closing ? 'lightboxFadeOut 0.2s ease forwards' : 'lightboxFadeIn 0.25s ease',
      }}
      onClick={onBackdropClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Close */}
      <button
        ref={closeButtonRef}
        className="absolute top-4 right-4 text-white hover:scale-110 transition z-50"
        onClick={(e) => {
          e.stopPropagation();
          requestClose();
        }}
        aria-label="Close"
      >
        <X className="h-8 w-8" />
      </button>

      {/* Prev / Next arrows */}
      {items.length > 1 && (
        <>
          <button
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 hover:scale-110 transition"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 hover:scale-110 transition"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </>
      )}

      {/* Image */}
      <div
        className="relative max-w-5xl max-h-[90vh] w-full h-full"
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
          opacity: dragOffset.y > 0 ? Math.max(0.3, 1 - dragOffset.y / 400) : 1,
          transition:
            dragStart.current !== null
              ? 'none'
              : 'transform 0.15s ease-out, opacity 0.15s ease-out',
          animation: 'lightboxZoomIn 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          key={item.id}
          src={item.imageUrl}
          alt={item.title || 'Gallery image'}
          fill
          className="object-contain"
          style={{ animation: 'slideCrossfade 0.3s ease' }}
          sizes="(max-width: 768px) 100vw, 80vw"
          priority
          draggable={false}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white pointer-events-none">
          {item.description && <p className="text-white/80">{item.description}</p>}
          {item.exif && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-white/70">
              {item.exif.dateTaken && <span>📅 {formatDate(item.exif.dateTaken)}</span>}
              {item.exif.camera && <span>📷 {item.exif.camera}</span>}
              {item.exif.lens && <span>🔭 {item.exif.lens}</span>}
              {item.exif.focalLength && <span>{item.exif.focalLength}</span>}
              {item.exif.aperture && <span>ƒ/{item.exif.aperture.replace(/^f\//i, '')}</span>}
              {item.exif.shutterSpeed && <span>{item.exif.shutterSpeed}s</span>}
              {item.exif.iso && <span>ISO {item.exif.iso}</span>}
              {item.exif.location && <span>📍 {item.exif.location}</span>}
            </div>
          )}
          {items.length > 1 && (
            <p className="text-xs text-white/40 mt-2">
              {index + 1} / {items.length}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Cache so we don't create duplicate prefetch requests on repeated hovers
const prefetched = new Set<string>();

function prefetchImage(src: string) {
  if (prefetched.has(src)) return;
  prefetched.add(src);
  const img = new window.Image();
  img.src = src;
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No artwork yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="group cursor-pointer relative overflow-hidden bg-zinc-900 mb-6 break-inside-avoid block w-full text-left"
            onClick={() => setSelectedIndex(index)}
            onMouseEnter={() => prefetchImage(item.imageUrl)}
            aria-label={item.title ? `Open photo: ${item.title}` : `Open photo ${index + 1}`}
          >
            <Image
              src={item.thumbnailUrl || item.imageUrl}
              alt={item.title || 'Gallery image'}
              width={item.width || 800}
              height={item.height || 600}
              className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <Lightbox
          items={items}
          index={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNavigate={setSelectedIndex}
        />
      )}
    </>
  );
}
