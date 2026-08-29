import type { SupabaseClient } from '@supabase/supabase-js';

type RateLimitConfig = { limit: number; windowMs: number };

/**
 * Simple fixed-window rate limit backed by a table instead of Redis/Upstash — proportionate
 * for this app's current scale, and avoids provisioning another piece of infra. Records one
 * event per allowed call; callers should check this before doing the expensive work (Gemini
 * call, Storage upload) so a request that gets rejected doesn't still cost anything.
 */
export async function checkRateLimit(
  supabase: SupabaseClient,
  userId: string,
  route: string,
  { limit, windowMs }: RateLimitConfig
): Promise<boolean> {
  const windowStart = new Date(Date.now() - windowMs).toISOString();

  const { count } = await supabase
    .from('rate_limit_events')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('route', route)
    .gte('created_at', windowStart);

  if ((count ?? 0) >= limit) return false;

  await supabase.from('rate_limit_events').insert({ user_id: userId, route });
  return true;
}
