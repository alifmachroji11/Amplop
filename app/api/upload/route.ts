import { NextResponse } from 'next/server';
import { getAuthContext, withOwner } from '@/lib/authContext';
import { supabaseServer } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rateLimit';

const RATE_LIMIT = { limit: 40, windowMs: 10 * 60 * 1000 }; // 40 uploads / 10 min per user

function safeExt(filename: string): string {
  const ext = filename.split('.').pop() ?? '';
  return /^[a-zA-Z0-9]{1,8}$/.test(ext) ? ext : 'jpg';
}

export async function POST(request: Request) {
  const ctx = await getAuthContext();
  if (!ctx.userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const supabase = supabaseServer();

  const allowed = await checkRateLimit(supabase, ctx.userId, 'upload', RATE_LIMIT);
  if (!allowed) {
    return NextResponse.json({ error: 'too many uploads, try again later' }, { status: 429 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const replacesUploadId = formData.get('replacesUploadId');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'missing file' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'file must be an image' }, { status: 400 });
  }

  const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB — keeps base64-inlined Gemini requests well within limits
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: 'file too large' }, { status: 400 });
  }

  const ext = safeExt(file.name);
  const uploadId = crypto.randomUUID();
  const storagePath = `${ctx.sessionId}/${uploadId}.${ext}`;

  const { error: storageError } = await supabase.storage
    .from('screenshots')
    .upload(storagePath, file, { contentType: file.type });

  if (storageError) {
    console.error('upload storage error', storageError);
    return NextResponse.json({ error: 'upload failed' }, { status: 500 });
  }

  const { error: insertError } = await supabase.from('uploads').insert({
    id: uploadId,
    session_id: ctx.sessionId,
    user_id: ctx.userId,
    storage_path: storagePath,
    status: 'uploaded',
  });

  if (insertError) {
    console.error('upload insert error', insertError);
    await supabase.storage.from('screenshots').remove([storagePath]);
    return NextResponse.json({ error: 'upload failed' }, { status: 500 });
  }

  // If this upload replaces a previously-failed one (e.g. "ganti foto" for a blurry image),
  // clean up the old upload's storage object and row so rejected photos don't accumulate
  // forever. Best-effort: the new upload above already succeeded either way.
  if (typeof replacesUploadId === 'string') {
    const { data: old } = await withOwner(
      supabase.from('uploads').select('id, storage_path').eq('id', replacesUploadId),
      ctx
    ).maybeSingle();

    if (old) {
      await supabase.storage.from('screenshots').remove([old.storage_path]);
      await supabase.from('uploads').delete().eq('id', old.id);
    }
  }

  return NextResponse.json({ uploadId, storagePath });
}
