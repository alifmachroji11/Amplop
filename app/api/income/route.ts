import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthContext } from '@/lib/authContext';
import { supabaseServer } from '@/lib/supabase/server';
import { INCOME_SOURCES, ALLOCATION_METHODS } from '@/lib/incomeAllocation';

const bodySchema = z
  .object({
    amount: z.number().positive(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    source: z.enum(INCOME_SOURCES),
    method: z.enum(ALLOCATION_METHODS),
    buckets: z
      .array(z.object({ name: z.string().min(1), amount: z.number().nonnegative() }))
      .min(1),
  })
  .refine((val) => Math.round(val.buckets.reduce((sum, b) => sum + b.amount, 0)) === Math.round(val.amount), {
    message: 'bucket amounts must sum to the total',
    path: ['buckets'],
  });

export async function POST(request: Request) {
  const ctx = await getAuthContext();
  if (!ctx.userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid input' }, { status: 400 });
  }

  const { amount, date, source, method, buckets } = parsed.data;
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      session_id: ctx.sessionId,
      user_id: ctx.userId,
      upload_id: null,
      merchant: source,
      occurred_at: date,
      amount_cents: Math.round(amount * 100),
      category: 'Pemasukan',
      confidence: null,
      is_blurry: false,
      income_allocation: {
        method,
        buckets: buckets.map((b) => ({ name: b.name, amount_cents: Math.round(b.amount * 100) })),
      },
    })
    .select()
    .single();

  if (error || !data) {
    console.error('income insert error', error);
    return NextResponse.json({ error: 'failed to save income' }, { status: 500 });
  }

  return NextResponse.json({ transaction: data });
}
