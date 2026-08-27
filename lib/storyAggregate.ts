import type { Transaction } from './types';
import { formatDateId } from './format';

export type StoryAggregate = {
  masukCents: number;
  keluarCents: number;
  topCategory: { name: string; cents: number } | null;
  trendText: string;
  biggestInboundLine: string | null;
};

export function computeStory(transactions: Transaction[], weekStart: Date): StoryAggregate {
  let masukCents = 0;
  let keluarCents = 0;
  const categoryTotals = new Map<string, number>();

  let biggestInbound: Transaction | null = null;
  let firstHalfSpend = 0;
  let secondHalfSpend = 0;

  const midpoint = new Date(weekStart);
  midpoint.setUTCDate(midpoint.getUTCDate() + 3);
  const midpointStr = midpoint.toISOString().slice(0, 10);

  for (const tx of transactions) {
    if (tx.amount_cents > 0) {
      masukCents += tx.amount_cents;
      if (!biggestInbound || tx.amount_cents > biggestInbound.amount_cents) {
        biggestInbound = tx;
      }
    } else {
      const spend = -tx.amount_cents;
      keluarCents += spend;
      categoryTotals.set(tx.category, (categoryTotals.get(tx.category) ?? 0) + spend);
      if (tx.occurred_at < midpointStr) firstHalfSpend += spend;
      else secondHalfSpend += spend;
    }
  }

  let topCategory: StoryAggregate['topCategory'] = null;
  for (const [name, cents] of categoryTotals) {
    if (!topCategory || cents > topCategory.cents) topCategory = { name, cents };
  }

  let trendText: string;
  if (firstHalfSpend === 0 && secondHalfSpend === 0) {
    trendText = 'Belum ada pengeluaran tercatat minggu ini.';
  } else if (firstHalfSpend > secondHalfSpend) {
    trendText = 'Minggu ini pengeluaranmu paling banyak di awal minggu, lalu mulai menurun menjelang akhir pekan.';
  } else if (secondHalfSpend > firstHalfSpend) {
    trendText = 'Minggu ini pengeluaranmu mulai naik menjelang akhir pekan, lebih tenang di awal minggu.';
  } else {
    trendText = 'Minggu ini pengeluaranmu cenderung merata dari awal sampai akhir minggu.';
  }

  const biggestInboundLine = biggestInbound
    ? `Ada satu transfer masuk cukup besar hari ${formatDateId(biggestInbound.occurred_at)}, kemungkinan itu bayaran kerja lepasmu.`
    : null;

  return { masukCents, keluarCents, topCategory, trendText, biggestInboundLine };
}
