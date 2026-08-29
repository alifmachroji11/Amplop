'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { todayJakarta } from '@/lib/weeks';
import {
  INCOME_SOURCES,
  ALLOCATION_METHODS,
  METHOD_BUCKETS,
  METHOD_LABELS,
  type AllocationMethod,
} from '@/lib/incomeAllocation';

function suggestedBuckets(method: AllocationMethod, amount: number) {
  const defs = METHOD_BUCKETS[method];
  let allocated = 0;
  return defs.map((b, i) => {
    // Last bucket absorbs the rounding remainder so the buckets always sum to `amount` exactly.
    const bucketAmount = i === defs.length - 1 ? amount - allocated : Math.round(amount * b.share);
    allocated += bucketAmount;
    return { name: b.name, amount: bucketAmount };
  });
}

export function IncomeForm() {
  const router = useRouter();
  const [amountInput, setAmountInput] = useState('');
  const [date, setDate] = useState(() => todayJakarta().toISOString().slice(0, 10));
  const [source, setSource] = useState<(typeof INCOME_SOURCES)[number]>(INCOME_SOURCES[0]);
  const [method, setMethod] = useState<AllocationMethod>('3stage');
  const [buckets, setBuckets] = useState(() => suggestedBuckets('3stage', 0));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = Number(amountInput) || 0;

  function applyMethod(next: AllocationMethod) {
    setMethod(next);
    setBuckets(suggestedBuckets(next, amount));
  }

  function applyAmount(value: string) {
    setAmountInput(value);
    const n = Number(value) || 0;
    setBuckets(suggestedBuckets(method, n));
  }

  function updateBucket(index: number, value: string) {
    const n = Number(value) || 0;
    setBuckets((prev) => prev.map((b, i) => (i === index ? { ...b, amount: n } : b)));
  }

  const allocated = buckets.reduce((sum, b) => sum + b.amount, 0);
  const sisa = amount - allocated;
  const canSubmit = amount > 0 && sisa === 0 && !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, date, source, method, buckets }),
      });
      if (!res.ok) {
        setError('Gagal menyimpan pemasukan, coba lagi.');
        return;
      }
      setAmountInput('');
      setBuckets(suggestedBuckets(method, 0));
      router.refresh();
    } catch {
      setError('Gagal menyimpan pemasukan, coba lagi.');
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    'w-full rounded-card border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-sage';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-ink-soft">Nominal (Rp)</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={amountInput}
            onChange={(e) => applyAmount(e.target.value)}
            placeholder="5000000"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-ink-soft">Tanggal</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium text-ink-soft">Asal pemasukan</span>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value as (typeof INCOME_SOURCES)[number])}
          className={inputClass}
        >
          {INCOME_SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <div>
        <span className="mb-1.5 block text-[13px] font-medium text-ink-soft">Metode alokasi</span>
        <div className="flex flex-col gap-2 sm:flex-row">
          {ALLOCATION_METHODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => applyMethod(m)}
              className={`flex-1 rounded-card border px-3.5 py-2.5 text-left text-[13px] transition-colors ${
                method === m
                  ? 'border-sage bg-sage-tint text-sage-ink'
                  : 'border-border bg-surface text-ink-soft hover:border-sage'
              }`}
            >
              {METHOD_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-card border border-border bg-surface-muted p-4">
        <div className="mb-3 text-[13px] font-medium text-ink-soft">
          Mau ditempatkan sebagai kebutuhan apa?
        </div>
        <div className="flex flex-col gap-2.5">
          {buckets.map((bucket, i) => (
            <div key={bucket.name} className="flex items-center gap-3">
              <span className="flex-1 text-sm text-ink">{bucket.name}</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={bucket.amount || ''}
                onChange={(e) => updateBucket(i, e.target.value)}
                className="w-32 rounded-card border border-border bg-surface px-2.5 py-1.5 text-right text-sm text-ink outline-none focus:border-sage"
              />
            </div>
          ))}
        </div>
        <div
          className={`mt-3 text-right text-[13px] font-medium ${
            sisa === 0 ? 'text-income-text' : 'text-expense-text'
          }`}
        >
          {sisa === 0 ? 'Semua sudah dialokasikan' : `Sisa belum dialokasikan: Rp${sisa.toLocaleString('id-ID')}`}
        </div>
      </div>

      {error && <div className="text-[13px] text-expense-text">{error}</div>}

      <Button type="submit" disabled={!canSubmit} className="self-start">
        {submitting ? 'Menyimpan…' : 'Catat pemasukan'}
      </Button>
    </form>
  );
}
