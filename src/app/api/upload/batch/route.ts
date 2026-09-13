import { NextRequest, NextResponse } from 'next/server';
import { addItems } from '@/lib/storage';
import { requireAdmin } from '@/lib/gallery-auth';
import { buildGalleryItem } from '@/lib/photo-build';

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

interface BatchResult {
  ok: boolean;
  index: number;
  item?: unknown;
  error?: string;
}

// Accepts multiple files under the repeated field name `file`, with parallel
// repeated fields `title`, `description`, and `exif` matched by index. Builds
// every item, then persists them in a SINGLE storage write — avoiding the
// read-modify-write race that caused bulk uploads to clobber each other.
export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const files = formData.getAll('file').filter((f): f is File => f instanceof File);
    const titles = formData.getAll('title');
    const descriptions = formData.getAll('description');
    const exifs = formData.getAll('exif');

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Build each item (validate + Cloudinary upload + EXIF). Run sequentially so
    // a single huge batch doesn't exhaust memory / Cloudinary rate limits.
    const built: { index: number; item: Awaited<ReturnType<typeof buildGalleryItem>> }[] = [];
    const results: BatchResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const item = await buildGalleryItem({
          file,
          title: str(titles[i]) ?? '',
          description: str(descriptions[i]),
          clientExifRaw: exifs[i] ?? null,
        });
        built.push({ index: i, item });
      } catch (error: unknown) {
        const err = error as { message?: string };
        results.push({ ok: false, index: i, error: err?.message || 'Upload failed' });
      }
    }

    // One atomic read-append-write for the whole batch.
    if (built.length > 0) {
      await addItems(built.map((b) => b.item));
      // addItems mutates order in place; reflect success per index.
      for (const { index, item } of built) {
        results.push({ ok: true, index, item });
      }
    }

    // Return results sorted by original index so the client can map statuses.
    results.sort((a, b) => a.index - b.index);
    const anyOk = results.some((r) => r.ok);
    return NextResponse.json({ results }, { status: anyOk ? 200 : 400 });
  } catch (error: unknown) {
    console.error('Batch upload error:', error);
    const err = error as { message?: string };
    return NextResponse.json({ error: err?.message || 'Batch upload failed' }, { status: 500 });
  }
}
