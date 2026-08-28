import Link from 'next/link';
import { PhoneShell } from '@/components/ui/PhoneShell';
import { Button } from '@/components/ui/Button';
import { StoryHeader } from '@/components/story/StoryHeader';
import { SummaryCard } from '@/components/story/SummaryCard';
import { CategoryHighlight } from '@/components/story/CategoryHighlight';
import { NarrativeBlock } from '@/components/story/NarrativeBlock';
import { ShareStoryPdfButton } from '@/components/story/ShareStoryPdfButton';
import { getAuthContext, withOwner } from '@/lib/authContext';
import { supabaseServer } from '@/lib/supabase/server';
import { weekRange } from '@/lib/weeks';
import { formatDateRangeId, formatDateRangeFullId } from '@/lib/format';
import { computeStory } from '@/lib/storyAggregate';
import type { Transaction } from '@/lib/types';

export default async function StoryPage(props: PageProps<'/story/[weekId]'>) {
  const { weekId } = await props.params;
  const auth = await getAuthContext();
  const { start, end } = weekRange(weekId);

  const supabase = supabaseServer();
  const { data } = await withOwner(supabase.from('transactions').select('*'), auth)
    .gte('occurred_at', start.toISOString().slice(0, 10))
    .lte('occurred_at', end.toISOString().slice(0, 10));

  const transactions = (data ?? []) as Transaction[];
  const story = computeStory(transactions, start);

  return (
    <PhoneShell active="story">
      <div className="min-h-[800px] px-6.5 pt-9 pb-12.5 lg:min-h-[520px] lg:max-w-[600px] lg:px-11 lg:pt-11 lg:pb-11">
        <StoryHeader dateRange={formatDateRangeId(start, end)} />

        <NarrativeBlock>
          <span className="font-serif text-[21px] leading-relaxed text-ink lg:text-[24px]">{story.trendText}</span>
        </NarrativeBlock>

        <SummaryCard masukCents={story.masukCents} keluarCents={story.keluarCents} />

        {story.topCategory && (
          <NarrativeBlock>
            Pengeluaran terbesarmu untuk{' '}
            <strong className="text-ink">{story.topCategory.name}</strong>. Kebanyakan
            dibayar pakai QRIS di siang hari, sepertinya kamu lagi sibuk kerja.
          </NarrativeBlock>
        )}

        {story.topCategory && (
          <CategoryHighlight name={story.topCategory.name} amount={story.topCategory.cents / 100} />
        )}

        {story.biggestInboundLine && <NarrativeBlock>{story.biggestInboundLine}</NarrativeBlock>}

        <div className="pt-6 pb-1.5 text-center">
          <div className="mb-3.5 text-[13px] text-ink-faint">
            Mau lihat semua transaksinya satu-satu?
          </div>
          <Link href={`/transactions?week=${weekId}`}>
            <Button variant="secondary" className="!px-7 !py-3.5 !text-sm">
              Lihat daftar transaksi
            </Button>
          </Link>
        </div>

        <div className="pt-3 pb-1.5 text-center">
          <ShareStoryPdfButton
            weekId={weekId}
            dateRangeLabel={formatDateRangeFullId(start, end)}
            transactions={transactions}
            masukCents={story.masukCents}
            keluarCents={story.keluarCents}
          />
        </div>
      </div>
    </PhoneShell>
  );
}
