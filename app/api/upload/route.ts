import { NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/authContext';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const ctx = await getAuthContext();
  if (!ctx.userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

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

  const supabase = supabaseServer();
  const ext = file.name.split('.').pop() || 'jpg';
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

  return NextResponse.json({ uploadId, storagePath });
}
