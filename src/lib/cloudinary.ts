import { v2 as cloudinary } from 'cloudinary';

// Lazy explicit config — throwing at import time breaks `next build`, which
// imports route modules during page-data collection (no env vars in CI).
// So we validate on first use instead: fail fast on the first actual call.
let configured = false;

function ensureConfigured() {
  if (configured) return;
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
  configured = true;
}

const RESPONSIVE_BREAKPOINTS = {
  create_derived: true,
  bytes_step: 20000,
  min_width: 200,
  max_width: 1200,
  max_images: 5,
};

export function getThumbnailUrl(publicId: string) {
  ensureConfigured();
  return cloudinary.url(publicId, {
    width: 800,
    crop: 'limit',
    quality: 'auto:best',
    fetch_format: 'auto',
    dpr: 'auto',
  });
}

// Signed-upload payload for direct browser -> Cloudinary uploads. The server
// never sees the file bytes, so Vercel's 4.5MB function payload limit doesn't
// apply. All params sent by the client must be covered by the signature.
export function getUploadSignature(folder: string = 'photography') {
  ensureConfigured();
  const timestamp = Math.round(Date.now() / 1000);
  const responsiveBreakpoints = JSON.stringify(RESPONSIVE_BREAKPOINTS);
  const paramsToSign: Record<string, string | number> = {
    timestamp,
    folder,
    image_metadata: 'true',
    responsive_breakpoints: responsiveBreakpoints,
  };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );
  return {
    timestamp,
    folder,
    imageMetadata: 'true',
    responsiveBreakpoints,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
  };
}

export async function uploadImage(file: string, folder: string = 'gallery') {
  ensureConfigured();
  const result = await cloudinary.uploader.upload(file, {
    folder: folder,
    image_metadata: true,
    quality: 'auto:good',
    fetch_format: 'auto',
    responsive_breakpoints: RESPONSIVE_BREAKPOINTS,
  });

  return {
    id: result.public_id,
    url: result.secure_url,
    thumbnail: getThumbnailUrl(result.public_id),
    width: result.width,
    height: result.height,
    metadata: (result.image_metadata ?? {}) as Record<string, unknown>,
  };
}

export async function deleteImage(publicId: string) {
  ensureConfigured();
  await cloudinary.uploader.destroy(publicId);
}
