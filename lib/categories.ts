export const CATEGORIES = [
  'Makan & jajan',
  'Belanja harian',
  'Transport',
  'Keluarga',
  'Pemasukan',
  'Lainnya',
] as const;

export type Category = (typeof CATEGORIES)[number];
