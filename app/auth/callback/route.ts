import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSessionId } from '@/lib/session';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const origin = url.origin;
  if (!code) return NextResponse.redirect(`${origin}/?login_error=1`);

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cs) => cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) return NextResponse.redirect(`${origin}/?login_error=1`);

  // Link this browser's anonymous data to the user. Idempotent, runs on
  // every login (not gated to "first login") so it self-heals any gaps.
  const sessionId = await getSessionId();
  const admin = supabaseServer();
  await Promise.all([
    admin.from('uploads').update({ user_id: data.user.id }).eq('session_id', sessionId).is('user_id', null),
    admin.from('transactions').update({ user_id: data.user.id }).eq('session_id', sessionId).is('user_id', null),
  ]);

  return NextResponse.redirect(`${origin}/`);
}
