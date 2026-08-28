const JAKARTA_TZ = 'Asia/Jakarta';

/** Reads a date's calendar y/m/d as seen in Asia/Jakarta, regardless of server-process timezone. */
function jakartaYMD(date: Date): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: JAKARTA_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)!.value);
  return { year: get('year'), month: get('month') - 1, day: get('day') };
}

function startOfIsoWeek(date: Date): Date {
  const { year, month, day: dom } = jakartaYMD(date);
  const d = new Date(Date.UTC(year, month, dom));
  const day = d.getUTCDay() || 7; // Mon=1 .. Sun=7
  if (day !== 1) d.setUTCDate(d.getUTCDate() - (day - 1));
  return d;
}

function isoWeekNumber(date: Date): { year: number; week: number } {
  const { year: y, month, day: dom } = jakartaYMD(date);
  const d = new Date(Date.UTC(y, month, dom));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { year: d.getUTCFullYear(), week };
}

export function weekIdFor(date: Date): string {
  const { year, week } = isoWeekNumber(date);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export function currentWeekId(): string {
  return weekIdFor(new Date());
}

export function weekRange(weekId: string): { start: Date; end: Date } {
  const match = /^(\d{4})-W(\d{2})$/.exec(weekId);
  if (!match) throw new Error(`invalid weekId: ${weekId}`);
  const year = Number(match[1]);
  const week = Number(match[2]);
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const week1Start = startOfIsoWeek(jan4);
  const start = new Date(week1Start);
  start.setUTCDate(start.getUTCDate() + (week - 1) * 7);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  return { start, end };
}
