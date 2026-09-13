import { NextRequest, NextResponse } from 'next/server';
import {
  applySessionCookie,
  clearSessionCookie,
  createSessionToken,
  isAuthenticatedRequest,
  verifyPassword,
} from '@/lib/gallery-auth';

export async function GET(request: NextRequest) {
  return NextResponse.json({ authenticated: isAuthenticatedRequest(request) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!verifyPassword(body?.password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    return applySessionCookie(response, createSessionToken());
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  return clearSessionCookie(response);
}
