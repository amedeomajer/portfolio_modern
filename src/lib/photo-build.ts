import { uploadImage } from '@/lib/cloudinary';
import { v4 as uuidv4 } from 'uuid';
import { ExifData, GalleryItem } from '@/types/gallery';
import { isEmptyExif, normalizeExif } from '@/lib/exif';

// Throwable error carrying an HTTP status + optional upstream code.
export class UploadError extends Error {
  status: number;
  http_code?: number;
  constructor(message: string, status = 400, http_code?: number) {
    super(message);
    this.status = status;
    this.http_code = http_code;
  }
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

// Server-side validation — never trust the client. Checked before the
// base64 conversion and Cloudinary call so junk input costs us nothing.
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_BYTES = 10 * 1024 * 1024; // Cloudinary free-tier upload limit

function validateFile(file: File): void {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new UploadError(
      `Unsupported file type: ${file.type || 'unknown'}. Use JPEG, PNG, or WebP.`
    );
  }
  if (file.size === 0) {
    throw new UploadError('File is empty.');
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new UploadError(
      `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 10MB.`
    );
  }
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

interface BuildInput {
  file: File;
  title?: string;
  description?: string;
  clientExifRaw: FormDataEntryValue | null;
}

// Build a fully-formed GalleryItem for a single file: validate -> upload to
// Cloudinary -> resolve EXIF (Cloudinary first, client fallback). Order is
// assigned separately by the caller so a whole batch shares one addItems().
export async function buildGalleryItem({
  file,
  title,
  description,
  clientExifRaw,
}: BuildInput): Promise<GalleryItem> {
  validateFile(file);

  // Convert file to base64
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = `data:${file.type || 'application/octet-stream'};base64,${buffer.toString('base64')}`;

  // Upload to Cloudinary
  const result = await uploadImage(base64, 'photography');

  // EXIF: prefer Cloudinary's extraction; fall back to validated client-side EXIF
  let exif = normalizeExif(result.metadata);
  if (isEmptyExif(exif)) {
    const clientExif = parseClientExif(clientExifRaw);
    if (clientExif) exif = clientExif;
  }

  return {
    id: uuidv4(),
    cloudinaryId: result.id,
    imageUrl: result.url,
    thumbnailUrl: result.thumbnail,
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    date: exif.dateTaken ?? new Date().toISOString(),
    exif,
    order: 0, // placeholder — reassigned by storage.addItems
    width: result.width,
    height: result.height,
  };
}