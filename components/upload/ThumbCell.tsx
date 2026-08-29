import { useRef } from 'react';
import type { ThumbItem } from '@/lib/uploadTypes';

export function ThumbCell({
  item,
  onReplace,
}: {
  item: ThumbItem;
  onReplace?: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inFlight = item.status === 'queued' || item.status === 'uploading' || item.status === 'processing';
  const canReplace = item.status === 'failed' && item.failReason === 'blurry' && !!onReplace;

  return (
    <div className="relative aspect-square overflow-hidden rounded-card bg-surface-muted">
      <img
        src={item.previewUrl}
        alt=""
        className="h-full w-full object-cover"
        style={inFlight ? { animation: 'pulse 2.2s ease-in-out infinite' } : undefined}
      />
      {item.status === 'done' && (
        <div className="absolute inset-0 flex items-center justify-center bg-ink/[.06]">
          <div className="mt-[-4px] h-[9px] w-[18px] rotate-[-45deg] border-b-2 border-l-2 border-sage" />
        </div>
      )}
      {item.status === 'failed' && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-0.5 rounded-card bg-expense-text/[.08] ${canReplace ? 'cursor-pointer' : ''}`}
          onClick={canReplace ? () => inputRef.current?.click() : undefined}
        >
          <span className="text-[11px] text-expense-text">
            {item.failReason === 'blurry' ? 'buram' : 'gagal'}
          </span>
          {canReplace && (
            <span className="text-[10px] text-expense-text underline">ganti foto</span>
          )}
        </div>
      )}
      {canReplace && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onReplace!(file);
          }}
        />
      )}
    </div>
  );
}
