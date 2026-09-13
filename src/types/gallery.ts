export interface ExifData {
  dateTaken?: string;
  camera?: string;
  lens?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  focalLength?: string;
  location?: string;
}

export interface GalleryItem {
  id: string;
  cloudinaryId: string;
  imageUrl: string;
  thumbnailUrl: string;
  title?: string;
  description?: string;
  date: string;
  order: number;
  width?: number;
  height?: number;
  exif?: ExifData;
}
