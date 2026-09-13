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

// Naive in-memory rate limit: max 5 failed attempts per minute per IP.
// Good enough for a single-admin portfolio; resets on server restart.
const failedAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = failedAttempts.get(ip);
  if (!entry || entry.resetAt < now) return false;
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(ip: string) {
  const now = Date.now();
  const entry = failedAttempts.get(ip);
  if (!entry || entry.resetAt < now) {
    failedAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many attempts. Try again in a minute.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    if (!verifyPassword(body?.password)) {
      recordFailure(ip);
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
    failedAttempts.delete(ip);

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
