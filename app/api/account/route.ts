import { NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/authContext';
import { supabaseServer } from '@/lib/supabase/server';

/** Deletes every trace of the logged-in user's data, then the auth account itself. */
export async function DELETE() {
  const ctx = await getAuthContext();
  if (!ctx.userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const supabase = supabaseServer();

  const { data: uploads } = await supabase
    .from('uploads')
    .select('storage_path')
    .eq('user_id', ctx.userId);

  if (uploads && uploads.length > 0) {
    await supabase.storage.from('screenshots').remove(uploads.map((u) => u.storage_path));
  }

  await supabase.from('transactions').delete().eq('user_id', ctx.userId);
  await supabase.from('uploads').delete().eq('user_id', ctx.userId);
  await supabase.from('rate_limit_events').delete().eq('user_id', ctx.userId);

  const { error: deleteUserError } = await supabase.auth.admin.deleteUser(ctx.userId);
  if (deleteUserError) {
    console.error('account delete: failed to delete auth user', deleteUserError);
    return NextResponse.json({ error: 'failed to delete account' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
