'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { CategorySelect } from './CategorySelect';
import { formatDateId, formatRupiah } from '@/lib/format';
import type { Transaction } from '@/lib/types';

export function TransactionRow({
  transaction,
  onCategoryChange,
}: {
  transaction: Transaction;
  onCategoryChange: (id: string, category: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const isIncome = transaction.amount_cents >= 0;

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-0.5 text-[15px] font-semibold text-ink">{transaction.merchant}</div>
          <div className="text-[12.5px] text-ink-faint">{formatDateId(transaction.occurred_at)}</div>
        </div>
        <div
          className={`ml-3 whitespace-nowrap font-serif text-base font-semibold ${
            isIncome ? 'text-income-text' : 'text-expense-text'
          }`}
        >
          {formatRupiah(transaction.amount_cents / 100)}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {editing ? (
          <>
            <CategorySelect
              value={transaction.category}
              isIncome={isIncome}
              onChange={(value) => onCategoryChange(transaction.id, value)}
            />
            <button
              onClick={() => setEditing(false)}
              className="cursor-pointer rounded-pill border-none bg-sage px-3.5 py-1.5 text-[13px] text-white"
            >
              Selesai
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="cursor-pointer rounded-pill border border-border bg-sage-tint px-3.5 py-1.5 text-[13px] text-sage-ink"
            >
              {transaction.category}
            </button>
            <span className="text-xs text-ink-faint">ketuk untuk ubah kategori</span>
          </>
        )}
      </div>
    </Card>
  );
}
