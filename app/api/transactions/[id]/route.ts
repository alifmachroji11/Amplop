import { NextResponse } from 'next/server';
import { getAuthContext, withOwner } from '@/lib/authContext';
import { supabaseServer } from '@/lib/supabase/server';
import { CATEGORIES } from '@/lib/categories';

export async function PATCH(request: Request, routeCtx: RouteContext<'/api/transactions/[id]'>) {
  const { id } = await routeCtx.params;
  const auth = await getAuthContext();
  if (!auth.userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { category } = await request.json();

  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'invalid category' }, { status: 400 });
  }

  const supabase = supabaseServer();

  const { data: existing, error: fetchError } = await withOwner(
    supabase.from('transactions').select('amount_cents').eq('id', id),
    auth
  ).single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: 'transaction not found' }, { status: 404 });
  }

  // Category must agree with the transaction's sign (mirrors the same rule the Gemini
  // parser enforces) — otherwise story/PDF totals and narrative go inconsistent.
  const isIncome = existing.amount_cents >= 0;
  if ((category === 'Pemasukan') !== isIncome) {
    return NextResponse.json({ error: 'category does not match transaction sign' }, { status: 400 });
  }

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
