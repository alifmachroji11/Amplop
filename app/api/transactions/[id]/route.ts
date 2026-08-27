import { NextResponse } from 'next/server';
import { getAuthContext, withOwner } from '@/lib/authContext';
import { supabaseServer } from '@/lib/supabase/server';
import { CATEGORIES } from '@/lib/categories';

export async function PATCH(request: Request, routeCtx: RouteContext<'/api/transactions/[id]'>) {
  const { id } = await routeCtx.params;
  const auth = await getAuthContext();
  const { category } = await request.json();

  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'invalid category' }, { status: 400 });
  }

  const supabase = supabaseServer();

  const { data, error } = await withOwner(
    supabase
      .from('transactions')
      .update({ category, updated_at: new Date().toISOString() })
      .eq('id', id),
    auth
  )
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'transaction not found' }, { status: 404 });
  }

  return NextResponse.json({ transaction: data });
}
