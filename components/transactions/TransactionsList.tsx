'use client';

import { useState } from 'react';
import { TransactionRow } from './TransactionRow';
import type { Transaction } from '@/lib/types';
import type { Category } from '@/lib/categories';

export function TransactionsList({ initial }: { initial: Transaction[] }) {
  const [transactions, setTransactions] = useState(initial);

  async function handleCategoryChange(id: string, category: string) {
    const previous = transactions;
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, category: category as Category } : tx))
    );

    const res = await fetch(`/api/transactions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category }),
    });

    if (!res.ok) setTransactions(previous);
  }

  return (
    <div className="flex flex-col gap-2.5">
      {transactions.map((tx) => (
        <TransactionRow key={tx.id} transaction={tx} onCategoryChange={handleCategoryChange} />
      ))}
    </div>
  );
}
