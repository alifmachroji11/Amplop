'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { weekIdFor, todayJakarta } from '@/lib/weeks';
import { MONTH_NAMES } from '@/lib/format';

const DAY_HEADERS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function mondayIndex(year: number, month: number, day: number): number {
  const jsDay = new Date(Date.UTC(year, month, day)).getUTCDay(); // 0=Sun..6=Sat
  return (jsDay + 6) % 7; // 0=Mon..6=Sun
}

export function MonthCalendar() {
  const router = useRouter();
  const today = useMemo(() => todayJakarta(), []);
  const [viewYear, setViewYear] = useState(today.getUTCFullYear());
  const [viewMonth, setViewMonth] = useState(today.getUTCMonth());

  function goToMonth(delta: number) {
    let month = viewMonth + delta;
    let year = viewYear;
    if (month < 0) {
      month = 11;
      year -= 1;
    } else if (month > 11) {
      month = 0;
      year += 1;
    }
    setViewMonth(month);
    setViewYear(year);
  }

  function selectDay(day: number) {
    const date = new Date(Date.UTC(viewYear, viewMonth, day));
    router.push(`/story/${weekIdFor(date)}`);
  }

  const leadingBlanks = mondayIndex(viewYear, viewMonth, 1);
  const totalDays = daysInMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-card border border-border p-5">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => goToMonth(-1)}
          aria-label="Bulan sebelumnya"
          className="cursor-pointer rounded-card px-2.5 py-1.5 text-ink-soft hover:bg-surface-muted"
        >
          ‹
        </button>
        <div className="font-serif text-lg text-ink">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </div>
        <button
          onClick={() => goToMonth(1)}
          aria-label="Bulan berikutnya"
          className="cursor-pointer rounded-card px-2.5 py-1.5 text-ink-soft hover:bg-surface-muted"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="pb-1.5 text-[11px] text-ink-faint">
            {d}
          </div>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <div key={`blank-${i}`} />;

          const cellDate = new Date(Date.UTC(viewYear, viewMonth, day));
          const isToday = cellDate.getTime() === today.getTime();
          const isFuture = cellDate.getTime() > today.getTime();

          return (
            <button
              key={day}
              onClick={() => selectDay(day)}
              className={`aspect-square cursor-pointer rounded-card text-[13px] transition-colors hover:bg-sage-tint-2 ${
                isToday
                  ? 'bg-sage font-semibold text-white hover:bg-sage'
                  : isFuture
                    ? 'text-ink-faint'
                    : 'text-ink'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
