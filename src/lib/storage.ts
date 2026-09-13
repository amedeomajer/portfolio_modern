import { put, list } from '@vercel/blob';
import { GalleryItem } from '@/types/gallery';

const BLOB_PATH = 'gallery/items.json';

function sortByOrder(items: GalleryItem[]): GalleryItem[] {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

async function getBlobUrl(): Promise<string | null> {
  const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
  const blob = blobs.find((b) => b.pathname === BLOB_PATH);
  return blob?.url ?? null;
}

export async function getItems(): Promise<GalleryItem[]> {
  try {
    const url = await getBlobUrl();
    if (!url) return [];
    // Cache-bust to always get the latest version after an overwrite.
    // Note: single JSON blob is fine for single-admin use; no locking/transactions.
    const res = await fetch(`${url}?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const items = (await res.json()) as GalleryItem[];
    return sortByOrder(Array.isArray(items) ? items : []);
  } catch (error) {
    console.error('Failed to read gallery items:', error);
    return [];
  }
}

export async function saveItems(items: GalleryItem[]) {
  await put(BLOB_PATH, JSON.stringify(sortByOrder(items)), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

// Add one or more items in a SINGLE read-append-write, assigning order numbers
// from the current max. This avoids the lost-update race where many sequential
// read-modify-writes each clobber the prior write (Vercel Blob has no locking /
// transactions). Callers pass items with a placeholder order; it's reassigned.
export async function addItems(newItems: GalleryItem[]) {
  if (newItems.length === 0) return [];
  const items = await getItems();
  let next = items.reduce((max, item) => Math.max(max, item.order ?? 0), -1) + 1;
  for (const item of newItems) item.order = next++;
  items.push(...newItems);
  await saveItems(items);
  return newItems;
}

export async function addItem(item: GalleryItem) {
  await addItems([item]);
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
