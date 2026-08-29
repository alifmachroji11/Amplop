export function formatRupiah(cents: number): string {
  const abs = Math.abs(cents);
  const sign = cents < 0 ? '-' : '+';
  return `${sign}Rp${abs.toLocaleString('id-ID')}`;
}

export function formatRupiahCompact(cents: number): string {
  const abs = Math.abs(cents);
  if (abs >= 1_000_000) {
    const jt = abs / 1_000_000;
    return `Rp${jt.toLocaleString('id-ID', { maximumFractionDigits: 1 })}jt`;
  }
  if (abs >= 1_000) {
    const rb = abs / 1_000;
    return `Rp${rb.toLocaleString('id-ID', { maximumFractionDigits: 0 })}rb`;
  }
  return `Rp${abs.toLocaleString('id-ID')}`;
}

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
export const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

export function formatDateId(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00');
  return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
}

// start/end come from lib/weeks.ts's weekRange(), which represents Asia/Jakarta calendar
// dates as UTC-midnight Date objects — read them with UTC accessors, not local ones, or
// this drifts a day depending on the server/browser's own timezone.
export function formatDateRangeId(start: Date, end: Date): string {
  const sameMonth = start.getUTCMonth() === end.getUTCMonth();
  const startStr = sameMonth
    ? `${start.getUTCDate()}`
    : `${start.getUTCDate()} ${MONTH_NAMES[start.getUTCMonth()]}`;
  return `${startStr}–${end.getUTCDate()} ${MONTH_NAMES[end.getUTCMonth()]}`;
}

const FULL_MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

/** Same as formatDateRangeId but spelled out in full, with year — for shareable documents (PDF). */
export function formatDateRangeFullId(start: Date, end: Date): string {
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const sameMonth = sameYear && start.getUTCMonth() === end.getUTCMonth();
  let startStr: string;
  if (sameMonth) {
    startStr = `${start.getUTCDate()}`;
  } else if (sameYear) {
    startStr = `${start.getUTCDate()} ${FULL_MONTH_NAMES[start.getUTCMonth()]}`;
  } else {
    // Week spans a year boundary (e.g. ISO week 1) — spell out the start year too, otherwise
    // "29 Desember–4 Januari 2026" reads as if both dates were 2026.
    startStr = `${start.getUTCDate()} ${FULL_MONTH_NAMES[start.getUTCMonth()]} ${start.getUTCFullYear()}`;
  }
  return `${startStr}–${end.getUTCDate()} ${FULL_MONTH_NAMES[end.getUTCMonth()]} ${end.getUTCFullYear()}`;
}
