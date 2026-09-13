// One-off cleanup: wipe ALL gallery data (Vercel Blob) + ALL Cloudinary assets
// in the photography folder. Usage: node scripts/wipe-gallery.mjs
import { readFileSync } from 'node:fs';
import { v2 as cloudinary } from 'cloudinary';
import { list, del, put } from '@vercel/blob';

// Load .env.local manually (no Next.js runtime here)
for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const BLOB_PATH = 'gallery/items.json';

async function main() {
  // 1. Read current gallery items (for logging + targeted deletes)
  let items = [];
  try {
    const { blobs } = await list({ prefix: BLOB_PATH, limit: 5 });
    const blob = blobs.find((b) => b.pathname === BLOB_PATH);
    if (blob) {
      const res = await fetch(`${blob.url}?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) items = await res.json();
    }
  } catch (e) {
    console.warn('Could not read items.json (continuing):', e.message);
  }
  console.log(`Found ${items.length} item(s) in gallery/items.json`);

  // 2. Delete every Cloudinary asset in the photography folder (catches
  //    stragglers that were uploaded but lost from items.json by the race bug)
  let deletedCloudinary = 0;
  try {
    let cursor;
    do {
      const res = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'photography',
        max_results: 500,
        next_cursor: cursor,
      });
      const ids = res.resources.map((r) => r.public_id);
      if (ids.length) {
        const delRes = await cloudinary.api.delete_resources(ids);
        deletedCloudinary += Object.values(delRes.deleted).filter((s) => s === 'deleted').length;
      }
      cursor = res.next_cursor;
    } while (cursor);
    console.log(`Deleted ${deletedCloudinary} Cloudinary asset(s) under 'photography/'`);
  } catch (e) {
    console.error('Cloudinary delete failed:', e.message);
  }

  // 3. Try deleting the folder itself (only works when empty)
  try {
    await cloudinary.api.delete_folder('photography');
    console.log("Removed empty 'photography' folder");
  } catch {
    console.log("'photography' folder not empty or already gone (fine)");
  }

  // 4. Delete the items.json blob entirely, then recreate it empty so reads
  //    return [] instead of 404 noise.
  try {
    const { blobs } = await list({ prefix: BLOB_PATH, limit: 10 });
    for (const b of blobs) await del(b.url);
    await put(BLOB_PATH, JSON.stringify([]), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    });
    console.log('Reset gallery/items.json to []');
  } catch (e) {
    console.error('Blob reset failed:', e.message);
  }

  console.log('\nDone. Gallery + Cloudinary wiped.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
