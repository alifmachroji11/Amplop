import { PhoneShell } from '@/components/ui/PhoneShell';
import { IncomeForm } from '@/components/income/IncomeForm';
import { IncomeHistory } from '@/components/income/IncomeHistory';
import { getAuthContext, withOwner } from '@/lib/authContext';
import { supabaseServer } from '@/lib/supabase/server';
import type { Transaction } from '@/lib/types';

export default async function PemasukanPage() {
  const ctx = await getAuthContext();
  const supabase = supabaseServer();

  const { data } = await withOwner(
    supabase
      .from('transactions')
      .select('*')
      .eq('category', 'Pemasukan')
      .not('income_allocation', 'is', null),
    ctx
  ).order('occurred_at', { ascending: false });

  const incomes = (data ?? []) as Transaction[];

  return (
    <PhoneShell active="pemasukan">
      <div className="min-h-[800px] px-6 pt-8 pb-10 lg:min-h-[520px] lg:px-11 lg:pt-11 lg:pb-11">
        <div className="mb-1.5 font-serif text-2xl text-ink lg:text-[28px]">Catat pemasukan</div>
        <p className="mb-6 max-w-[520px] text-sm leading-relaxed text-ink-soft lg:text-base">
          Catat dari mana pemasukanmu datang, lalu tentukan mau ditempatkan ke kebutuhan apa.
        </p>

        <IncomeForm />

        <div className="mt-10">
          <div className="mb-3 text-[13px] font-medium tracking-wide text-ink-faint uppercase">
            Riwayat pemasukan
          </div>
          <IncomeHistory incomes={incomes} />
        </div>
      </div>
    </PhoneShell>
  );
}
