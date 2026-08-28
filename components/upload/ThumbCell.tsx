import type { ThumbItem } from '@/lib/uploadTypes';

export function ThumbCell({ item }: { item: ThumbItem }) {
  const inFlight = item.status === 'queued' || item.status === 'uploading' || item.status === 'processing';

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
        <div className="absolute inset-0 flex items-center justify-center rounded-card bg-expense-text/[.08]">
          <span className="text-[11px] text-expense-text">
            {item.failReason === 'blurry' ? 'buram' : 'gagal'}
          </span>
        </div>
      )}
    </div>
  );
}
