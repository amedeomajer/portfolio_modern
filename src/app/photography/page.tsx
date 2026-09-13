'use client';

import { useEffect, useState } from 'react';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { GalleryItem } from '@/types/gallery';

// Deterministic pseudo-random heights so the skeleton doesn't reshuffle on re-render
const SKELETON_HEIGHTS = [320, 420, 260, 380, 300, 460, 340, 280, 400, 360, 240, 440];

function GallerySkeleton() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
      {SKELETON_HEIGHTS.map((height, i) => (
        <div
          key={i}
          className="mb-6 break-inside-avoid rounded bg-zinc-900 overflow-hidden relative"
          style={{ height }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/60 to-transparent animate-[shimmer_1.5s_infinite]"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        </div>
      ))}
    </div>
  );
}

export default function PhotographyPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await fetch('/api/gallery');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Failed to load images', error);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Photography</h1>
        </header>

        {loading ? <GallerySkeleton /> : <GalleryGrid items={items} />}
      </div>
    </div>
  );
}
