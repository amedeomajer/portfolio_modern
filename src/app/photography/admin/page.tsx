'use client';

import { useState, useEffect } from 'react';
import { AdminPanel } from '@/components/gallery/AdminPanel';
import { GalleryItem } from '@/types/gallery';

export default function AdminPhotographyPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await fetch('/api/gallery');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Failed to load items', error);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading Admin...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Gallery Management</h1>
          <p className="text-zinc-500">Manage your photography and painting collections.</p>
        </header>
        <AdminPanel initialItems={items} />
      </div>
    </div>
  );
}
