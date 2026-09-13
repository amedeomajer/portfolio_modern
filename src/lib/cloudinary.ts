import { v2 as cloudinary } from 'cloudinary';

// Explicit config — fail fast at startup if credentials are missing/misnamed,
// instead of relying on CLOUDINARY_URL auto-discovery.
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error(
    'Missing Cloudinary env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET'
  );
}
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: string, folder: string = 'gallery') {
  const result = await cloudinary.uploader.upload(file, {
    folder: folder,
    image_metadata: true,
    quality: 'auto:good',
    fetch_format: 'auto',
    responsive_breakpoints: {
      create_derived: true,
      bytes_step: 20000,
      min_width: 200,
      max_width: 1200,
      max_images: 5,
    },
  });

  return {
    id: result.public_id,
    url: result.secure_url,
    thumbnail: cloudinary.url(result.public_id, {
      width: 800,
      crop: 'limit',
      quality: 'auto:best',
      fetch_format: 'auto',
      dpr: 'auto',
    }),
    width: result.width,
    height: result.height,
    metadata: (result.image_metadata ?? {}) as Record<string, unknown>,
  };
}

export async function deleteImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}
