import { AuthStatus } from '@/components/auth/AuthStatus';
import { Sidebar } from '@/components/app/Sidebar';
import { getAuthContext, withOwner } from '@/lib/authContext';
import { getAuthUser } from '@/lib/supabase/authServer';
import { supabaseServer } from '@/lib/supabase/server';
import { currentWeekId, weekRange } from '@/lib/weeks';
import { computeStory } from '@/lib/storyAggregate';
import type { Transaction } from '@/lib/types';
import type { NavKey } from '@/components/app/navKeys';

export async function PhoneShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active: NavKey;
}) {
  const [user, ctx] = await Promise.all([getAuthUser(), getAuthContext()]);
  const { start, end } = weekRange(currentWeekId());
  const supabase = supabaseServer();
  const { data } = await withOwner(supabase.from('transactions').select('*'), ctx)
    .gte('occurred_at', start.toISOString().slice(0, 10))
    .lte('occurred_at', end.toISOString().slice(0, 10));
  const { masukCents, keluarCents } = computeStory((data ?? []) as Transaction[], start);

  return (
    <div className="flex min-h-screen flex-col items-center bg-bg px-4 pt-1 lg:flex-row lg:items-start lg:justify-center lg:gap-14 lg:px-10 lg:pt-16">
      <Sidebar active={active} email={user?.email ?? null} masukCents={masukCents} keluarCents={keluarCents} />
      <div className="relative mt-1 mb-[60px] w-full max-w-[414px] overflow-hidden rounded-phone bg-surface shadow-phone">
        <div className="lg:hidden">
          <AuthStatus />
        </div>
        {children}
      </div>
    </div>
  );
}
