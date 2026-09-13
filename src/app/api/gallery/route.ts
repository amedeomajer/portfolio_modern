import { NextResponse } from 'next/server';
import { getItems, saveItems, updateItem, deleteItem } from '@/lib/storage';

export async function GET() {
  const items = await getItems();
  return NextResponse.json(items);
}

export async function PUT(request: Request) {
  const { items } = await request.json();
  await saveItems(items);
  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const { id, ...data } = await request.json();
  const updated = await updateItem(id, data);
  if (updated) {
    return NextResponse.json(updated);
  }
  return NextResponse.json({ error: 'Item not found' }, { status: 404 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const success = await deleteItem(id);
  if (success) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Item not found' }, { status: 404 });
}
