import { createClient } from '@supabase/supabase-js';

/**
 * Server-only client using the service role key. There is no auth/RLS model
 * in this MVP (see amplop_sid session cookie), so every query must manually
 * filter by session_id — never expose this client to the browser.
 */
export function supabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
