import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/session';
import { refreshAuthSession } from '@/lib/supabase/middleware';

const TWO_YEARS = 60 * 60 * 24 * 365 * 2;

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV === 'development';
  const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

  // style-src stays 'unsafe-inline' rather than nonce'd: a few components use inline `style={{}}`
  // attributes (small CSS animations), and CSP has no nonce mechanism for the style *attribute*
  // (only for <style>/<link> tags). script-src is the directive that actually matters for
  // blocking injected/XSS script execution, so that one stays strict.
  return `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    connect-src 'self' ${supabaseOrigin};
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export async function proxy(request: NextRequest) {
  const existingSessionId = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // A brand-new session id is only minted for a top-level document navigation, never for a
  // sub-resource request (fetch/XHR/prefetch) that happens to race that navigation before the
  // browser has applied its Set-Cookie. Modern browsers always send `Sec-Fetch-Dest` on
  // fetch/XHR (as a non-"document" value); clients that omit the header entirely (curl, older
  // browsers) fall back to the old "mint if missing" behavior so they still work.
  const fetchDest = request.headers.get('sec-fetch-dest');
  const isSubResourceRequest = fetchDest !== null && fetchDest !== 'document';
  const isNewSession = !existingSessionId && !isSubResourceRequest;
  const sessionId = existingSessionId ?? (isNewSession ? crypto.randomUUID() : undefined);

  if (isNewSession && sessionId) {
    // Set on the request too, not just the response — otherwise code running later in this
    // same request (e.g. getSessionId() in a page/route reached on someone's very first hit)
    // still sees no cookie and throws, since request/response cookies are separate stores.
    request.cookies.set(SESSION_COOKIE_NAME, sessionId);
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);

  // Refresh + persist Supabase auth cookies on every request (no-op if not logged in).
  const supabase = refreshAuthSession(request, response);
  await supabase.auth.getUser();

  if (isNewSession && sessionId) {
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
