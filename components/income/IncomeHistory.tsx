import { formatDateId, formatRupiah } from '@/lib/format';
import { METHOD_LABELS } from '@/lib/incomeAllocation';
import type { Transaction } from '@/lib/types';

export function IncomeHistory({ incomes }: { incomes: Transaction[] }) {
  if (incomes.length === 0) {
    return <div className="text-sm text-ink-faint">Belum ada pemasukan manual yang dicatat.</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      {incomes.map((tx) => (
        <div key={tx.id} className="rounded-card border border-border bg-surface p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[15px] font-semibold text-ink">{tx.merchant}</div>
              <div className="text-[12.5px] text-ink-faint">{formatDateId(tx.occurred_at)}</div>
            </div>
            <div className="font-serif text-base font-semibold text-income-text">
              {formatRupiah(tx.amount_cents / 100)}
            </div>
          </div>

          {tx.income_allocation && (
            <div className="mt-3 border-t border-border pt-3">
              <div className="mb-1.5 text-[11px] tracking-wide text-ink-faint uppercase">
                {METHOD_LABELS[tx.income_allocation.method]}
              </div>
              <div className="flex flex-col gap-1">
                {tx.income_allocation.buckets.map((b) => (
                  <div key={b.name} className="flex justify-between text-[13px] text-ink-soft">
                    <span>{b.name}</span>
                    <span>Rp{(b.amount_cents / 100).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
