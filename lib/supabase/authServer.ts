import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Anon-key client bound to request cookies, used ONLY to read the logged-in
 * user (auth.getUser()). Never query app tables with this — uploads/
 * transactions RLS is deny-all; all data access goes through
 * lib/supabase/server.ts's service-role client instead.
 */
export async function getAuthUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll() {
          // no-op: proxy.ts refreshes + persists the session cookies on every request
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
