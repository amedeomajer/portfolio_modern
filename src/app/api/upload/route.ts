import { NextRequest, NextResponse } from 'next/server';
import { addItems } from '@/lib/storage';
import { requireAdmin } from '@/lib/gallery-auth';
import { buildGalleryItem, UploadError } from '@/lib/photo-build';

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    const item = await buildGalleryItem({
      file,
      title: str(formData.get('title')) ?? '',
      description: str(formData.get('description')),
      clientExifRaw: formData.get('exif'),
    });

    await addItems([item]);
    return NextResponse.json(item);
  } catch (error: unknown) {
    console.error('Upload error:', error);
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const err = error as { message?: string; http_code?: number };
    const message = err?.message || 'Upload failed';
    return NextResponse.json({ error: message }, { status: err?.http_code || 500 });
  }
}
