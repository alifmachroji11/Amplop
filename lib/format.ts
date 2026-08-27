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
const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

export function formatDateId(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00');
  return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
}

export function formatDateRangeId(start: Date, end: Date): string {
  const sameMonth = start.getMonth() === end.getMonth();
  const startStr = sameMonth
    ? `${start.getDate()}`
    : `${start.getDate()} ${MONTH_NAMES[start.getMonth()]}`;
  return `${startStr}–${end.getDate()} ${MONTH_NAMES[end.getMonth()]}`;
}
