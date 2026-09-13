import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { addItem } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';
import { ExifData } from '@/types/gallery';

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

function extractExif(meta: Record<string, unknown>): ExifData {
  const make = str(meta.Make);
  const model = str(meta.Model);
  const camera = [make, model]
    .filter(Boolean)
    .join(' ')
    .replace(/^(\S+)\s+\1/i, '$1') // dedupe "Canon Canon ..."
    || undefined;

  const latRaw = meta.GPSLatitude;
  const lonRaw = meta.GPSLongitude;
  const lat = typeof latRaw === 'number' ? latRaw.toFixed(5) : str(latRaw);
  const lon = typeof lonRaw === 'number' ? lonRaw.toFixed(5) : str(lonRaw);

  return {
    dateTaken: str(meta.DateTimeOriginal) ?? str(meta.DateTime),
    camera,
    lens: str(meta.LensModel) ?? str(meta.LensSpecification),
    aperture: str(meta.FNumber) ?? str(meta.ApertureValue),
    shutterSpeed: str(meta.ExposureTime),
    iso: str(meta.ISO),
    focalLength: str(meta.FocalLength),
    location: lat && lon ? `${lat}, ${lon}` : undefined,
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = (formData.get('title') as string) || '';
    const description = (formData.get('description') as string) || '';

    if (!file) {
      return NextResponse.json(
        { error: 'Missing file' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await uploadImage(base64, 'photography');

    // EXIF: prefer Cloudinary's extraction; fall back to client-side EXIF
    // (sent when the image was compressed in the browser, stripping metadata)
    let exif = extractExif(result.metadata);
    const clientExifRaw = formData.get('exif') as string | null;
    if (clientExifRaw && Object.values(exif).every((v) => v === undefined)) {
      try {
        exif = JSON.parse(clientExifRaw);
      } catch {
        // ignore malformed client exif
      }
    }

    // Save to Blob
    const newItem = {
      id: uuidv4(),
      cloudinaryId: result.id,
      imageUrl: result.url,
      thumbnailUrl: result.thumbnail,
      title,
      description,
      date: exif.dateTaken ?? new Date().toISOString(),
      exif,
      order: 0,
      width: result.width,
      height: result.height,
    };

    await addItem(newItem);
    return NextResponse.json(newItem);
  } catch (error: any) {
    console.error('Upload error:', error);
    const message = error?.message || 'Upload failed';
    return NextResponse.json(
      { error: message },
      { status: error?.http_code || 500 }
    );
  }
}
