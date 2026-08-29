'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dropzone } from '@/components/upload/Dropzone';
import { ThumbGrid } from '@/components/upload/ThumbGrid';
import { ProcessingBanner } from '@/components/upload/ProcessingBanner';
import { PartialFailCard } from '@/components/upload/PartialFailCard';
import { runPool } from '@/lib/pool';
import type { ThumbItem, ThumbStatus } from '@/lib/uploadTypes';

const CONCURRENCY = 3;

export function UploadFlow() {
  const router = useRouter();
  const [items, setItems] = useState<ThumbItem[]>([]);
  const navigated = useRef(false);

  function updateItem(id: string, patch: Partial<ThumbItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  async function processFromUpload(item: ThumbItem) {
    updateItem(item.id, { status: 'uploading' });

    const formData = new FormData();
    formData.append('file', item.file);

    const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!uploadRes.ok) {
      updateItem(item.id, { status: 'failed', failReason: 'error' });
      return;
    }
    const { uploadId } = await uploadRes.json();
    updateItem(item.id, { uploadId, status: 'processing' });
    await processFromParse(item.id, uploadId);
  }

  async function processFromParse(itemId: string, uploadId: string) {
    updateItem(itemId, { status: 'processing' });
    try {
      const parseRes = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId }),
      });
      const body = await parseRes.json();
      const status: ThumbStatus = body.status === 'done' ? 'done' : 'failed';
      updateItem(itemId, { status, failReason: status === 'failed' ? (body.reason ?? 'error') : undefined });
    } catch {
      updateItem(itemId, { status: 'failed', failReason: 'error' });
    }
  }

  function addFiles(fileList: FileList) {
    const newItems: ThumbItem[] = Array.from(fileList).map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'queued',
    }));
    setItems((prev) => [...prev, ...newItems]);
    runPool(newItems, CONCURRENCY, processFromUpload);
  }

  function retryFailed() {
    // Blurry failures need a different photo, not a re-read of the same bytes — those are
    // retried individually via replaceItem() from the thumbnail itself. Bulk retry here only
    // covers transient failures ('error'), and re-runs the full pipeline (not just parse) for
    // any item that failed before it even got an uploadId, so it isn't silently skipped.
    const retryable = items.filter((it) => it.status === 'failed' && it.failReason !== 'blurry');
    runPool(retryable, CONCURRENCY, (item) =>
      item.uploadId ? processFromParse(item.id, item.uploadId) : processFromUpload(item)
    );
  }

  function replaceItem(id: string, file: File) {
    const replacement: ThumbItem = { id, file, previewUrl: URL.createObjectURL(file), status: 'queued' };
    setItems((prev) => prev.map((it) => (it.id === id ? replacement : it)));
    processFromUpload(replacement);
  }

  const total = items.length;
  const doneCount = items.filter((it) => it.status === 'done').length;
  const failedCount = items.filter((it) => it.status === 'failed').length;
  const anyInFlight = items.some((it) => it.status === 'queued' || it.status === 'uploading' || it.status === 'processing');
  const settled = total > 0 && !anyInFlight;

  useEffect(() => {
    if (settled && failedCount === 0 && !navigated.current) {
      navigated.current = true;
      router.push('/story');
    }
  }, [settled, failedCount, router]);

  return (
    <div className="min-h-[800px] px-6 pt-8 pb-10 lg:min-h-[520px] lg:px-11 lg:pt-11 lg:pb-11">
      <div className="mb-1.5 font-serif text-2xl text-ink lg:text-[28px]">Unggah screenshot</div>
      <p className="mb-5.5 max-w-[480px] text-sm leading-relaxed text-ink-soft lg:text-base">
        Pilih semua screenshot sekaligus. Tidak perlu dipisah-pisah dulu.
      </p>

      {total === 0 && <Dropzone onFiles={addFiles} />}

      {total > 0 && !settled && (
        <div>
          <ThumbGrid items={items} />
          <ProcessingBanner doneCount={doneCount} total={total} />
        </div>
      )}

      {settled && failedCount > 0 && (
        <div>
          <ThumbGrid items={items} onReplace={replaceItem} />
          <PartialFailCard
            doneCount={doneCount}
            total={total}
            allBlurry={items.filter((it) => it.status === 'failed').every((it) => it.failReason === 'blurry')}
            onRetry={retryFailed}
            onSkip={() => router.push('/story')}
          />
        </div>
      )}
    </div>
  );
}
