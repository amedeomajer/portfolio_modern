import { ExifData } from '@/types/gallery';

/**
 * Normalizes raw EXIF metadata into our ExifData shape.
 * Accepts either:
 *  - Cloudinary `image_metadata` output (mostly strings, e.g. "2026:08:12 16:19:04", "1/250")
 *  - exifr client-side output (Date objects and numbers, e.g. Date, 0.004, 2.8)
 *
 * Used by both the upload API route (Cloudinary) and the browser uploader (exifr),
 * so compressed and uncompressed uploads produce identical display data.
 */
export function normalizeExif(raw: Record<string, unknown>): ExifData {
  return {
    dateTaken: normalizeDate(raw.DateTimeOriginal ?? raw.DateTime ?? raw.CreateDate),
    camera: normalizeCamera(raw.Make, raw.Model),
    lens: str(raw.LensModel) ?? str(raw.LensSpecification),
    aperture: normalizeAperture(raw.FNumber ?? raw.ApertureValue),
    shutterSpeed: normalizeShutter(raw.ExposureTime),
    iso: normalizeNumber(raw.ISO),
    focalLength: normalizeFocalLength(raw.FocalLength),
    location: normalizeLocation(raw.GPSLatitude ?? raw.latitude, raw.GPSLongitude ?? raw.longitude),
  };
}

export function isEmptyExif(exif: ExifData): boolean {
  return Object.values(exif).every((v) => v === undefined);
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

/** exifr returns Date; Cloudinary returns "YYYY:MM:DD HH:MM:SS" or ISO-ish strings */
function normalizeDate(v: unknown): string | undefined {
  if (v instanceof Date && !isNaN(v.getTime())) return v.toISOString();
  return str(v);
}

/** Join make + model, deduping "Canon Canon 5D" style repeats */
function normalizeCamera(make: unknown, model: unknown): string | undefined {
  const parts = [str(make), str(model)].filter(Boolean) as string[];
  if (parts.length === 0) return undefined;
  const joined = parts.join(' ');
  // Dedupe if model already starts with make ("Canon Canon EOS R5" or "Canon EOS R5" with make "Canon")
  if (parts.length === 2 && parts[1]!.toLowerCase().startsWith(parts[0]!.toLowerCase())) {
    return parts[1];
  }
  return joined;
}

/** Cloudinary: "2.8" (string). exifr: 2.8 (number). Output: "2.8" */
function normalizeAperture(v: unknown): string | undefined {
  if (typeof v === 'number') return String(v);
  return str(v);
}

/** Cloudinary: "1/250" (string). exifr: 0.004 (number). Output: "1/250" or "2" */
function normalizeShutter(v: unknown): string | undefined {
  if (typeof v === 'number') {
    if (v <= 0) return undefined;
    return v < 1 ? `1/${Math.round(1 / v)}` : String(v);
  }
  return str(v);
}

function normalizeNumber(v: unknown): string | undefined {
  if (typeof v === 'number') return String(v);
  return str(v);
}

/** Output: "35 mm" (Cloudinary may already include units) */
function normalizeFocalLength(v: unknown): string | undefined {
  if (typeof v === 'number') return `${v} mm`;
  const s = str(v);
  if (!s) return undefined;
  return /mm$/i.test(s) ? s : `${s} mm`;
}

/** exifr: latitude/longitude numbers. Cloudinary: GPSLatitude/GPSLongitude numbers or strings */
function normalizeLocation(lat: unknown, lon: unknown): string | undefined {
  const latStr = typeof lat === 'number' ? lat.toFixed(5) : str(lat);
  const lonStr = typeof lon === 'number' ? lon.toFixed(5) : str(lon);
  return latStr && lonStr ? `${latStr}, ${lonStr}` : undefined;
}
