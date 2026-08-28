import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/session';
import { refreshAuthSession } from '@/lib/supabase/middleware';

const TWO_YEARS = 60 * 60 * 24 * 365 * 2;

export async function proxy(request: NextRequest) {
  const isNewSession = !request.cookies.get(SESSION_COOKIE_NAME);
  const sessionId = request.cookies.get(SESSION_COOKIE_NAME)?.value ?? crypto.randomUUID();
  if (isNewSession) {
    // Set on the request too, not just the response — otherwise code running later in this
    // same request (e.g. getSessionId() in a page/route reached on someone's very first hit)
    // still sees no cookie and throws, since request/response cookies are separate stores.
    request.cookies.set(SESSION_COOKIE_NAME, sessionId);
  }

  const response = NextResponse.next({ request });

  // Refresh + persist Supabase auth cookies on every request (no-op if not logged in).
  const supabase = refreshAuthSession(request, response);
  await supabase.auth.getUser();

  if (isNewSession) {
    response.cookies.set(SESSION_COOKIE_NAME, sessionId, {
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
