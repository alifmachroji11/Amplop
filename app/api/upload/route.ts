import { NextResponse } from 'next/server';
import { getSessionId } from '@/lib/session';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const sessionId = await getSessionId();
  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'missing file' }, { status: 400 });
  }

  const supabase = supabaseServer();
  const ext = file.name.split('.').pop() || 'jpg';
  const uploadId = crypto.randomUUID();
  const storagePath = `${sessionId}/${uploadId}.${ext}`;

  const { error: storageError } = await supabase.storage
    .from('screenshots')
    .upload(storagePath, file, { contentType: file.type });

  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 });
  }

  const { error: insertError } = await supabase.from('uploads').insert({
    id: uploadId,
    session_id: sessionId,
    storage_path: storagePath,
    status: 'uploaded',
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ uploadId, storagePath });
}
