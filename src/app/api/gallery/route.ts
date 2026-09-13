import { NextRequest, NextResponse } from 'next/server';
import { getItems, saveItems, updateItem, deleteItem } from '@/lib/storage';
import { requireAdmin } from '@/lib/gallery-auth';
import { GalleryItem } from '@/types/gallery';

export async function GET() {
  const items = await getItems();
  return NextResponse.json(items);
}

export async function PUT(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const items = body?.items;
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items payload' }, { status: 400 });
    }

    await saveItems(items as GalleryItem[]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save items' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id, ...data } = await request.json();
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Missing item id' }, { status: 400 });
    }

    const updated = await updateItem(id, data);
    if (updated) return NextResponse.json(updated);
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await request.json();
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Missing item id' }, { status: 400 });
    }

    const success = await deleteItem(id);
    if (success) return NextResponse.json({ success: true });
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
