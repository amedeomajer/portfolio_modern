'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import ImageNext from 'next/image';
import exifr from 'exifr';
import { ExifData, GalleryItem } from '@/types/gallery';
import { normalizeExif } from '@/lib/exif';

// Extract EXIF before any canvas compression, which would otherwise strip it.
// exifr returns Dates/numbers; normalizeExif shapes them like Cloudinary's output.
async function extractExif(file: File): Promise<ExifData | null> {
  try {
    const data = await exifr.parse(file, {
      pick: [
        'DateTimeOriginal', 'CreateDate', 'Make', 'Model', 'LensModel',
        'FNumber', 'ExposureTime', 'ISO', 'FocalLength', 'latitude', 'longitude',
      ],
    });
    if (!data) return null;
    return normalizeExif(data as Record<string, unknown>);
  } catch {
    return null;
  }
}

interface ImageUploaderProps {
  onUpload: (item: GalleryItem) => void;
  onCancel: () => void;
}

const MAX_UPLOAD_BYTES = 9.5 * 1024 * 1024; // Cloudinary free tier: 10MB

// Re-encode oversized images via canvas. Note: this strips EXIF metadata,
// so only used when the original exceeds the upload limit.
async function compressImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  // Shrink dimensions until under limit (max 2 attempts)
  for (let attempt = 0; attempt < 2; attempt++) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.85)
    );
    if (blob && blob.size <= MAX_UPLOAD_BYTES) {
      return new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
    }
    width = Math.round(width * 0.7);
    height = Math.round(height * 0.7);
  }
  throw new Error('Could not compress image below 10MB');
}

type QueueStatus = 'pending' | 'uploading' | 'done' | 'error';

interface QueuedFile {
  id: string;
  file: File;
  preview: string;
  exif: ExifData | null;
  willCompress: boolean;
  title: string;
  description: string;
  status: QueueStatus;
  error?: string;
}

let queueId = 0;
const nextId = () => `q${++queueId}`;

// Default title from filename: "IMG_2041.jpg" -> "IMG_2041"
function titleFromFilename(name: string): string {
  return name.replace(/\.[^.]+$/, '');
}

export function ImageUploader({ onUpload, onCancel }: ImageUploaderProps) {
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const updateItem = (id: string, patch: Partial<QueuedFile>) => {
    setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  const removeItem = (id: string) => {
    setQueue((prev) => prev.filter((q) => q.id !== id));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      for (const file of acceptedFiles) {
        const id = nextId();
        const queued: QueuedFile = {
          id,
          file,
          preview: '',
          exif: null,
          willCompress: file.size > MAX_UPLOAD_BYTES,
          title: titleFromFilename(file.name),
          description: '',
          status: 'pending',
        };
        setQueue((prev) => [...prev, queued]);

        // Preview + EXIF load in the background so dropping many files stays snappy.
        const reader = new FileReader();
        reader.onloadend = () => updateItem(id, { preview: reader.result as string });
        reader.readAsDataURL(file);
        extractExif(file).then((exif) => updateItem(id, { exif }));
      }
    },
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    // No maxFiles — bulk upload
  });

  const pendingCount = queue.filter((q) => q.status === 'pending' || q.status === 'error').length;

  // Send the whole queue to /api/upload/batch in ONE request. The server builds
  // every item, then persists them in a single storage write — this avoids the
  // read-modify-write race that caused bulk uploads to clobber each other.
  const handleSubmit = async () => {
    const toUpload = queue.filter((q) => q.status === 'pending' || q.status === 'error');
    if (toUpload.length === 0) {
      alert('Please select at least one image');
      return;
    }

    setUploading(true);
    try {
      // Mark everything uploading, then compress oversized files client-side.
      const prepared: { item: QueuedFile; file: File }[] = [];
      for (const item of toUpload) {
        updateItem(item.id, { status: 'uploading', error: undefined });
        try {
          const file =
            item.file.size > MAX_UPLOAD_BYTES ? await compressImage(item.file) : item.file;
          prepared.push({ item, file });
        } catch (error: unknown) {
          updateItem(item.id, {
            status: 'error',
            error: error instanceof Error ? error.message : 'Compression failed',
          });
        }
      }

      if (prepared.length === 0) return;

      // Parallel repeated fields matched by index on the server.
      const formData = new FormData();
      for (const { item, file } of prepared) {
        formData.append('file', file);
        formData.append('title', item.title);
        formData.append('description', item.description);
        formData.append('exif', item.exif ? JSON.stringify(item.exif) : '');
      }

      const response = await fetch('/api/upload/batch', { method: 'POST', body: formData });
      const data = await response.json().catch(() => ({}));
      const results: { ok: boolean; index: number; item?: GalleryItem; error?: string }[] =
        Array.isArray(data.results) ? data.results : [];

      // Map each result back to its queued file via the batch index.
      for (const result of results) {
        const queued = prepared[result.index]?.item;
        if (!queued) continue;
        if (result.ok && result.item) {
          updateItem(queued.id, { status: 'done' });
          onUpload(result.item);
        } else {
          updateItem(queued.id, { status: 'error', error: result.error || 'Upload failed' });
        }
      }

      // If the server returned no per-file results at all, surface a generic error.
      if (results.length === 0) {
        for (const { item } of prepared) {
          updateItem(item.id, { status: 'error', error: data.error || 'Upload failed' });
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      for (const item of toUpload) {
        updateItem(item.id, { status: 'error', error: message });
      }
    } finally {
      setUploading(false);
    }
  };

  const allDone = queue.length > 0 && queue.every((q) => q.status === 'done');

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-700 hover:border-zinc-500'}`}
      >
        <input {...getInputProps()} />
        <ImagePlus className="mx-auto h-10 w-10 text-zinc-500" />
        <p className="mt-2 text-sm text-zinc-400">
          Drop images here, or click to select — multiple files supported
        </p>
        <p className="text-xs text-zinc-500 mt-1">Files over 10MB are automatically compressed</p>
      </div>

      {queue.length > 0 && (
        <ul className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {queue.map((item) => (
            <li
              key={item.id}
              className="flex gap-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-800"
            >
              <div className="relative h-20 w-20 shrink-0 bg-black rounded overflow-hidden">
                {item.preview && (
                  <ImageNext src={item.preview} alt={item.file.name} fill className="object-cover" />
                )}
                {item.status === 'done' && (
                  <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-400" />
                  </div>
                )}
                {item.status === 'uploading' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-zinc-500 truncate">{item.file.name}</p>
                  {item.status !== 'uploading' && (
                    <button
                      className="text-zinc-500 hover:text-red-400 shrink-0"
                      onClick={() => removeItem(item.id)}
                      title="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <input
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 text-sm text-white disabled:opacity-50"
                  placeholder="Title (optional)"
                  value={item.title}
                  disabled={item.status === 'uploading' || item.status === 'done'}
                  onChange={(e) => updateItem(item.id, { title: e.target.value })}
                />
                <input
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 text-sm text-white disabled:opacity-50"
                  placeholder="Description (optional)"
                  value={item.description}
                  disabled={item.status === 'uploading' || item.status === 'done'}
                  onChange={(e) => updateItem(item.id, { description: e.target.value })}
                />
                {item.willCompress && item.status === 'pending' && (
                  <p className="text-xs text-amber-400">
                    ⚠️ Over 10MB — will be compressed on upload. EXIF is still preserved.
                  </p>
                )}
                {item.status === 'error' && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {item.error}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2 justify-end">
        <button
          className="px-4 py-2 bg-zinc-700 text-white rounded-md disabled:opacity-50"
          onClick={onCancel}
          disabled={uploading}
        >
          {allDone ? 'Close' : 'Cancel'}
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
          onClick={handleSubmit}
          disabled={uploading || pendingCount === 0}
        >
          {uploading
            ? `Uploading ${pendingCount} image${pendingCount === 1 ? '' : 's'}...`
            : pendingCount > 1
              ? `Upload ${pendingCount} images`
              : 'Upload'}
        </button>
      </div>
    </div>
  );
}
