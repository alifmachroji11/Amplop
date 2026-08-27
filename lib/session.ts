import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'amplop_sid';

/**
 * The session cookie is set by proxy.ts on every request, so by the time
 * Server Components / Route Handlers run it should already exist.
 */
export async function getSessionId(): Promise<string> {
  const store = await cookies();
  const value = store.get(SESSION_COOKIE_NAME)?.value;
  if (!value) {
    throw new Error('missing amplop_sid cookie (proxy.ts should have set it)');
  }
  return value;
}
