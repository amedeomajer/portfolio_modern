import { put, list } from '@vercel/blob';
import { GalleryItem } from '@/types/gallery';

const BLOB_PATH = 'gallery/items.json';

async function getBlobUrl(): Promise<string | null> {
  const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
  const blob = blobs.find((b) => b.pathname === BLOB_PATH);
  return blob?.url ?? null;
}

export async function getItems(): Promise<GalleryItem[]> {
  try {
    const url = await getBlobUrl();
    if (!url) return [];
    // Cache-bust to always get the latest version after an overwrite
    const res = await fetch(`${url}?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()) as GalleryItem[];
  } catch (error) {
    console.error('Failed to read gallery items:', error);
    return [];
  }
}

export async function saveItems(items: GalleryItem[]) {
  await put(BLOB_PATH, JSON.stringify(items), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

export async function addItem(item: GalleryItem) {
  const items = await getItems();
  items.push(item);
  await saveItems(items);
  return item;
}

export async function updateItem(id: string, data: Partial<GalleryItem>) {
  const items = await getItems();
  const index = items.findIndex((item) => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...data };
    await saveItems(items);
    return items[index];
  }
  return null;
}

export async function deleteItem(id: string) {
  const items = await getItems();
  const item = items.find((i) => i.id === id);
  if (item) {
    const { deleteImage } = await import('./cloudinary');
    await deleteImage(item.cloudinaryId);
    await saveItems(items.filter((i) => i.id !== id));
    return true;
  }
  return false;
}

