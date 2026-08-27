import { formatRupiahCompact } from '@/lib/format';

export function CategoryHighlight({ name, amount }: { name: string; amount: number }) {
  return (
    <div className="mb-6 rounded-card border border-border bg-surface px-4 py-4.5">
      <div className="mb-2 text-xs text-ink-faint">Kategori terbesar</div>
      <div className="flex items-baseline justify-between">
        <div className="font-serif text-[19px] text-ink">{name}</div>
        <div className="text-[15px] font-semibold text-sage">
          {formatRupiahCompact(amount)}
        </div>
      </div>
    </div>
  );
}
