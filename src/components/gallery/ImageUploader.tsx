'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, X } from 'lucide-react';
import ImageNext from 'next/image';
import exifr from 'exifr';

// Extract the EXIF fields we care about before any canvas compression,
// which would otherwise strip them.
async function extractExif(file: File) {
  try {
    const data = await exifr.parse(file, {
      pick: [
        'DateTimeOriginal', 'CreateDate', 'Make', 'Model', 'LensModel',
        'FNumber', 'ExposureTime', 'ISO', 'FocalLength', 'latitude', 'longitude',
      ],
    });
    if (!data) return null;
    const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);
    return {
      dateTaken:
        data.DateTimeOriginal instanceof Date
          ? data.DateTimeOriginal.toISOString()
          : str(data.DateTimeOriginal),
      camera: [str(data.Make), str(data.Model)].filter(Boolean).join(' ') || undefined,
      lens: str(data.LensModel),
      aperture: data.FNumber != null ? String(data.FNumber) : undefined,
      shutterSpeed: data.ExposureTime != null
        ? data.ExposureTime < 1
          ? `1/${Math.round(1 / data.ExposureTime)}`
          : String(data.ExposureTime)
        : undefined,
      iso: data.ISO != null ? String(data.ISO) : undefined,
      focalLength: data.FocalLength != null ? `${data.FocalLength} mm` : undefined,
      location:
        data.latitude != null && data.longitude != null
          ? `${data.latitude.toFixed(5)}, ${data.longitude.toFixed(5)}`
          : undefined,
    };
  } catch {
    return null;
  }
}

interface ImageUploaderProps {
  onUpload: (item: any) => void;
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

export function ImageUploader({ onUpload, onCancel }: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [willCompress, setWillCompress] = useState(false);
  const [exifData, setExifData] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFile(file);
        setWillCompress(file.size > MAX_UPLOAD_BYTES);
        extractExif(file).then(setExifData);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    },
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
  });

  const handleSubmit = async () => {
    if (!file) {
      alert('Please select an image');
      return;
    }

    setUploading(true);
    const uploadFormData = new FormData();
    const fileToUpload = file.size > MAX_UPLOAD_BYTES ? await compressImage(file) : file;
    uploadFormData.append('file', fileToUpload);
    if (exifData) uploadFormData.append('exif', JSON.stringify(exifData));
    uploadFormData.append('title', formData.title);
    uploadFormData.append('description', formData.description);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed');
      
      onUpload(data);
    } catch (error: any) {
      alert(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
      {!preview ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-700 hover:border-zinc-500'}`}
        >
          <input {...getInputProps()} />
          <ImagePlus className="mx-auto h-12 w-12 text-zinc-500" />
          <p className="mt-2 text-sm text-zinc-400">Drop an image here, or click to select</p>
          <p className="text-xs text-zinc-500 mt-1">Files over 10MB are automatically compressed</p>
        </div>
      ) : (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <ImageNext src={preview} alt="Preview" fill className="object-contain" />
          <button 
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
            onClick={() => { setFile(null); setPreview(''); setWillCompress(false); }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="space-y-3">
        <input 
          className="w-full bg-zinc-800 border-zinc-700 rounded-md p-2 text-white"
          placeholder="Title (optional)" 
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        {willCompress && (
          <p className="text-xs text-amber-400">
            ⚠️ This file is over 10MB and will be compressed on upload. EXIF metadata will still be preserved.
          </p>
        )}
        <textarea 
          className="w-full bg-zinc-800 border-zinc-700 rounded-md p-2 text-white"
          placeholder="Description (optional)" 
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button className="px-4 py-2 bg-zinc-700 text-white rounded-md" onClick={onCancel}>Cancel</button>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50" 
          onClick={handleSubmit}
          disabled={uploading || !file}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
}
