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

function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const item = items[index];
  const dragStartX = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const goPrev = useCallback(() => {
    onNavigate((index - 1 + items.length) % items.length);
  }, [index, items.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((index + 1) % items.length);
  }, [index, items.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, goPrev, goNext]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Preload neighbors for instant navigation
  useEffect(() => {
    [items[(index + 1) % items.length], items[(index - 1 + items.length) % items.length]].forEach(
      (neighbor) => {
        if (neighbor) prefetchImage(neighbor.imageUrl);
      }
    );
  }, [index, items]);

  // Drag / swipe handling
  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current !== null) {
      setDragOffset(e.clientX - dragStartX.current);
    }
  };

  const onPointerUp = () => {
    if (dragStartX.current === null) return;
    const delta = dragOffset;
    dragStartX.current = null;
    setDragOffset(0);
    if (Math.abs(delta) > 60) {
      if (delta > 0) goPrev();
      else goNext();
    }
  };

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center select-none touch-none"
      onClick={onClose}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 text-white hover:scale-110 transition z-50"
        onClick={onClose}
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
        className="relative max-w-5xl max-h-[90vh] w-full h-full transition-transform duration-150"
        style={{ transform: `translateX(${dragOffset}px)` }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          key={item.id}
          src={item.imageUrl}
          alt={item.title || 'Gallery image'}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 80vw"
          priority
          draggable={false}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white pointer-events-none">
          {item.title && <h2 className="text-2xl font-bold">{item.title}</h2>}
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
          <div
            key={item.id}
            className="group cursor-pointer relative overflow-hidden bg-zinc-900 mb-6 break-inside-avoid"
            onClick={() => setSelectedIndex(index)}
            onMouseEnter={() => prefetchImage(item.imageUrl)}
          >
            <Image
              src={item.thumbnailUrl || item.imageUrl}
              alt={item.title || 'Gallery image'}
              width={item.width || 800}
              height={item.height || 600}
              className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>
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
