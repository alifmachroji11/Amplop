import { NextResponse } from 'next/server';
import { getAuthContext, withOwner } from '@/lib/authContext';
import { supabaseServer } from '@/lib/supabase/server';
import { parseScreenshot } from '@/lib/gemini';

export async function POST(request: Request) {
  const ctx = await getAuthContext();
  if (!ctx.userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { uploadId } = await request.json();

  if (typeof uploadId !== 'string') {
    return NextResponse.json({ error: 'missing uploadId' }, { status: 400 });
  }

  const supabase = supabaseServer();

  const { data: upload, error: uploadError } = await withOwner(
    supabase.from('uploads').select('*').eq('id', uploadId),
    ctx
  ).single();

  if (uploadError || !upload) {
    return NextResponse.json({ error: 'upload not found' }, { status: 404 });
  }

  // Compare-and-swap: only proceed if we're the request that flips uploaded/failed -> processing.
  // Stops a double-click or client retry from racing two concurrent Gemini calls/writes for the
  // same upload and having one silently clobber the other's result.
  const { data: claimed } = await supabase
    .from('uploads')
    .update({ status: 'processing' })
    .eq('id', uploadId)
    .in('status', ['uploaded', 'failed'])
    .select('id')
    .maybeSingle();

  if (!claimed) {
    return NextResponse.json({ status: upload.status === 'done' ? 'done' : 'processing' });
  }

  const { data: fileBlob, error: downloadError } = await supabase.storage
    .from('screenshots')
    .download(upload.storage_path);

  if (downloadError || !fileBlob) {
    await supabase
      .from('uploads')
      .update({ status: 'failed', error: 'could not download image' })
      .eq('id', uploadId);
    return NextResponse.json({ status: 'failed', reason: 'error' });
  }

  try {
    const arrayBuffer = await fileBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const result = await parseScreenshot(base64, fileBlob.type || 'image/jpeg');

    if (result.blurry || result.confidence < 0.5) {
      await supabase
        .from('uploads')
        .update({ status: 'failed', error: 'blurry or low confidence' })
        .eq('id', uploadId);
      return NextResponse.json({ status: 'failed', reason: 'blurry' });
    }

    const amountCents = Math.round(result.amount * 100) * (result.direction === 'out' ? -1 : 1);

    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .upsert(
        {
          session_id: ctx.sessionId,
          user_id: ctx.userId,
          upload_id: uploadId,
          merchant: result.merchant,
          occurred_at: result.date,
          amount_cents: amountCents,
          category: result.category,
          confidence: result.confidence,
          is_blurry: false,
        },
        { onConflict: 'upload_id' }
      )
      .select()
      .single();

    if (txError) throw txError;

    await supabase.from('uploads').update({ status: 'done' }).eq('id', uploadId);
    return NextResponse.json({ status: 'done', transaction });
  } catch (err) {
    await supabase
      .from('uploads')
      .update({ status: 'failed', error: err instanceof Error ? err.message : 'parse failed' })
      .eq('id', uploadId);
    return NextResponse.json({ status: 'failed', reason: 'error' });
  }
}
