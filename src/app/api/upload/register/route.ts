import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { addItems } from '@/lib/storage';
import { requireAdmin } from '@/lib/gallery-auth';
import { getThumbnailUrl } from '@/lib/cloudinary';
import { isEmptyExif, normalizeExif } from '@/lib/exif';
import { ExifData, GalleryItem } from '@/types/gallery';

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

// Client-extracted EXIF arrives already normalized — validate field-by-field.
function sanitizeExif(v: unknown): ExifData | null {
  if (typeof v !== 'object' || v === null) return null;
  const p = v as Record<string, unknown>;
  const exif: ExifData = {
    dateTaken: str(p.dateTaken),
    camera: str(p.camera),
    lens: str(p.lens),
    aperture: str(p.aperture),
    shutterSpeed: str(p.shutterSpeed),
    iso: str(p.iso),
    focalLength: str(p.focalLength),
    location: str(p.location),
  };
  return isEmptyExif(exif) ? null : exif;
}

interface RegisterResult {
  ok: boolean;
  index: number;
  item?: GalleryItem;
  error?: string;
}

// Registers images that were uploaded DIRECTLY to Cloudinary by the browser
// (see /api/upload/sign). Body: { uploads: [{ publicId, url, width, height,
// metadata, title, description, exif }] }. All items are persisted in a single
// storage write to avoid read-modify-write races.
export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const uploads: unknown[] = Array.isArray(body?.uploads) ? body.uploads : [];
    if (uploads.length === 0) {
      return NextResponse.json({ error: 'No uploads provided' }, { status: 400 });
    }

    const built: { index: number; item: GalleryItem }[] = [];
    const results: RegisterResult[] = [];

    for (let i = 0; i < uploads.length; i++) {
      const u = (uploads[i] ?? {}) as Record<string, unknown>;
      const publicId = str(u.publicId);
      const url = str(u.url);

      // Basic sanity checks — the client relays Cloudinary's response, so only
      // accept values shaped like a real Cloudinary upload result.
      if (!publicId || !url || !url.startsWith('https://res.cloudinary.com/')) {
        results.push({ ok: false, index: i, error: 'Invalid Cloudinary upload data' });
        continue;
      }

      // EXIF: prefer Cloudinary's extraction (relayed by client); fall back to
      // validated client-side EXIF.
      let exif = normalizeExif(
        (typeof u.metadata === 'object' && u.metadata !== null
          ? u.metadata
          : {}) as Record<string, unknown>
      );
      if (isEmptyExif(exif)) {
        const clientExif = sanitizeExif(u.exif);
        if (clientExif) exif = clientExif;
      }

      const title = str(u.title);
      const description = str(u.description);

      built.push({
        index: i,
        item: {
          id: uuidv4(),
          cloudinaryId: publicId,
          imageUrl: url,
          thumbnailUrl: getThumbnailUrl(publicId), // generated server-side
          ...(title ? { title } : {}),
          ...(description ? { description } : {}),
          date: exif.dateTaken ?? new Date().toISOString(),
          exif,
          order: 0, // placeholder — reassigned by storage.addItems
          width: typeof u.width === 'number' ? u.width : undefined,
          height: typeof u.height === 'number' ? u.height : undefined,
        },
      });
    }

    // One atomic read-append-write for the whole batch.
    if (built.length > 0) {
      await addItems(built.map((b) => b.item));
      for (const { index, item } of built) {
        results.push({ ok: true, index, item });
      }
    }

    results.sort((a, b) => a.index - b.index);
    const anyOk = results.some((r) => r.ok);
    return NextResponse.json({ results }, { status: anyOk ? 200 : 400 });
  } catch (error: unknown) {
    console.error('Register error:', error);
    const err = error as { message?: string };
    return NextResponse.json({ error: err?.message || 'Registration failed' }, { status: 500 });
  }
}
