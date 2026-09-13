import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { getItems } from '@/lib/storage';

// Always read the latest gallery state from Blob storage
export const dynamic = 'force-dynamic';

export default async function PhotographyPage() {
  const items = await getItems();

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
