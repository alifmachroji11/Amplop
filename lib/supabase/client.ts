'use client';

import { createBrowserClient } from '@supabase/ssr';

/** Browser client — used only for auth (sign-in trigger, sign-out), never for querying app tables. */
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
