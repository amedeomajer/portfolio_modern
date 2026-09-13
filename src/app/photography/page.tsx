'use client';

import { useEffect, useState } from 'react';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { GalleryItem } from '@/types/gallery';

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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading Gallery...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Photography</h1>
        </header>

        <GalleryGrid items={items} />
      </div>
    </div>
  );
}
