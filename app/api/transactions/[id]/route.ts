import { NextResponse } from 'next/server';
import { getSessionId } from '@/lib/session';
import { supabaseServer } from '@/lib/supabase/server';
import { CATEGORIES } from '@/lib/categories';

export async function PATCH(request: Request, ctx: RouteContext<'/api/transactions/[id]'>) {
  const { id } = await ctx.params;
  const sessionId = await getSessionId();
  const { category } = await request.json();

  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'invalid category' }, { status: 400 });
  }

  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from('transactions')
    .update({ category, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('session_id', sessionId)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'transaction not found' }, { status: 404 });
  }

  return NextResponse.json({ transaction: data });
}
