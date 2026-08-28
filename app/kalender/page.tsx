import { PhoneShell } from '@/components/ui/PhoneShell';
import { MonthCalendar } from '@/components/calendar/MonthCalendar';

export default function KalenderPage() {
  return (
    <PhoneShell active="kalender">
      <div className="min-h-[800px] px-6 pt-8 pb-10 lg:min-h-[520px] lg:px-11 lg:pt-11 lg:pb-11">
        <div className="mb-1.5 font-serif text-2xl text-ink lg:text-[28px]">Kalender</div>
        <p className="mb-5.5 max-w-[480px] text-sm leading-relaxed text-ink-soft lg:text-base">
          Pilih tanggal berapa pun buat lihat cerita keuangan minggu itu.
        </p>

        <MonthCalendar />
      </div>
    </PhoneShell>
  );
}
