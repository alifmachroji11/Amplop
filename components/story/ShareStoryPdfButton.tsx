'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { buildStoryPdf, shareOrDownloadPdf } from '@/lib/pdfExport';
import type { Transaction } from '@/lib/types';

export function ShareStoryPdfButton({
  weekId,
  dateRangeLabel,
  transactions,
  masukCents,
  keluarCents,
}: {
  weekId: string;
  dateRangeLabel: string;
  transactions: Transaction[];
  masukCents: number;
  keluarCents: number;
}) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    try {
      const doc = buildStoryPdf({ weekId, dateRangeLabel, transactions, masukCents, keluarCents });
      await shareOrDownloadPdf(doc, `amplop-cerita-${weekId}.pdf`, `Cerita keuangan periode ${dateRangeLabel}`);
    } finally {
      setPending(false);
    }
  }

  return (
    <Button variant="secondary" className="!px-7 !py-3.5 !text-sm" onClick={handleClick} disabled={pending}>
      {pending ? 'Menyiapkan PDF…' : 'Bagikan sebagai PDF'}
    </Button>
  );
}
