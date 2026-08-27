import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/session';
import { refreshAuthSession } from '@/lib/supabase/middleware';

const TWO_YEARS = 60 * 60 * 24 * 365 * 2;

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Refresh + persist Supabase auth cookies on every request (no-op if not logged in).
  const supabase = refreshAuthSession(request, response);
  await supabase.auth.getUser();

  if (!request.cookies.get(SESSION_COOKIE_NAME)) {
    response.cookies.set(SESSION_COOKIE_NAME, crypto.randomUUID(), {
      maxAge: TWO_YEARS,
      path: '/',
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
