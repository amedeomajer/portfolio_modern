import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { addItem, getItems } from '@/lib/storage';
import { requireAdmin } from '@/lib/gallery-auth';
import { v4 as uuidv4 } from 'uuid';
import { ExifData } from '@/types/gallery';
import { isEmptyExif, normalizeExif } from '@/lib/exif';

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

// Server-side validation — never trust the client. Checked before the
// base64 conversion and Cloudinary call so junk input costs us nothing.
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_BYTES = 10 * 1024 * 1024; // Cloudinary free-tier upload limit

function validateFile(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return `Unsupported file type: ${file.type || 'unknown'}. Use JPEG, PNG, or WebP.`;
  }
  if (file.size === 0) {
    return 'File is empty.';
  }
  if (file.size > MAX_FILE_BYTES) {
    return `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 10MB.`;
  }
  return null;
}

// Client EXIF arrives already normalized (from the shared normalizeExif in the
// browser) — validate it field-by-field as strings before trusting it.
function parseClientExif(raw: FormDataEntryValue | null): ExifData | null {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      dateTaken: str(parsed.dateTaken),
      camera: str(parsed.camera),
      lens: str(parsed.lens),
      aperture: str(parsed.aperture),
      shutterSpeed: str(parsed.shutterSpeed),
      iso: str(parsed.iso),
      focalLength: str(parsed.focalLength),
      location: str(parsed.location),
    };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const title = str(formData.get('title')) ?? '';
    const description = str(formData.get('description'));

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    const validationError = validateFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type || 'application/octet-stream'};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await uploadImage(base64, 'photography');

    // EXIF: prefer Cloudinary's extraction; fall back to validated client-side EXIF
    let exif = normalizeExif(result.metadata);
    if (isEmptyExif(exif)) {
      const clientExif = parseClientExif(formData.get('exif'));
      if (clientExif) exif = clientExif;
    }

    const existing = await getItems();
    const nextOrder =
      existing.reduce((max, item) => Math.max(max, item.order ?? 0), -1) + 1;

    const newItem = {
      id: uuidv4(),
      cloudinaryId: result.id,
      imageUrl: result.url,
      thumbnailUrl: result.thumbnail,
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      date: exif.dateTaken ?? new Date().toISOString(),
      exif,
      order: nextOrder,
      width: result.width,
      height: result.height,
    };

    await addItem(newItem);
    return NextResponse.json(newItem);
  } catch (error: unknown) {
    console.error('Upload error:', error);
    const err = error as { message?: string; http_code?: number };
    const message = err?.message || 'Upload failed';
    return NextResponse.json({ error: message }, { status: err?.http_code || 500 });
  }
}
