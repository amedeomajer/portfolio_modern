import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/gallery-auth';
import { getUploadSignature } from '@/lib/cloudinary';

// Issues a short-lived Cloudinary upload signature so the browser can upload
// files directly to Cloudinary (bypassing Vercel's 4.5MB function payload
// limit). Admin-only: without this, anyone could mint upload signatures.
export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    return NextResponse.json(getUploadSignature('photography'));
  } catch (error: unknown) {
    console.error('Sign error:', error);
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err?.message || 'Failed to create upload signature' },
      { status: 500 }
    );
  }
}
