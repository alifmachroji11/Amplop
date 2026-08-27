import Link from 'next/link';
import { PhoneShell } from '@/components/ui/PhoneShell';
import { TransactionsList } from '@/components/transactions/TransactionsList';
import { getAuthContext, withOwner } from '@/lib/authContext';
import { supabaseServer } from '@/lib/supabase/server';
import { weekRange } from '@/lib/weeks';
import type { Transaction } from '@/lib/types';

export default async function TransactionsPage(props: PageProps<'/transactions'>) {
  const { week } = await props.searchParams;
  const weekId = typeof week === 'string' ? week : undefined;
  const auth = await getAuthContext();

  const supabase = supabaseServer();
  let query = withOwner(supabase.from('transactions').select('*'), auth).order('occurred_at', {
    ascending: false,
  });

  if (weekId) {
    const { start, end } = weekRange(weekId);
    query = query
      .gte('occurred_at', start.toISOString().slice(0, 10))
      .lte('occurred_at', end.toISOString().slice(0, 10));
  }

  const { data } = await query;
  const transactions = (data ?? []) as Transaction[];

  return (
    <PhoneShell>
      <div className="min-h-[800px] px-6 pt-8 pb-10">
        <div className="mb-1.5 font-serif text-2xl text-ink">Yang berhasil terbaca</div>
        <p className="mb-5.5 text-sm leading-relaxed text-ink-soft">
          Ketuk transaksi yang mau kamu ubah. Selebihnya sudah benar.
        </p>

        <TransactionsList initial={transactions} />

        <div className="mt-5.5 text-center text-[13px] leading-relaxed text-ink-faint">
          Belum sempat mengecek semuanya? Tidak masalah, biarkan saja dulu — cerita
          keuanganmu tetap bisa dilihat.
        </div>

        <div className="mt-6 text-center">
          <Link href={weekId ? `/story/${weekId}` : '/'} className="text-[13px] text-ink-faint underline">
            Kembali
          </Link>
        </div>
      </div>
    </PhoneShell>
  );
}
