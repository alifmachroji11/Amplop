export const INCOME_SOURCES = ['Gaji', 'Freelance/Bisnis', 'Hadiah', 'Lainnya'] as const;
export type IncomeSource = (typeof INCOME_SOURCES)[number];

export const ALLOCATION_METHODS = ['piramida', '3stage'] as const;
export type AllocationMethod = (typeof ALLOCATION_METHODS)[number];

export type AllocationBucket = { name: string; amount_cents: number };

export type IncomeAllocation = {
  method: AllocationMethod;
  buckets: AllocationBucket[];
};

/** Bucket names + suggested default share of the total, per method. */
export const METHOD_BUCKETS: Record<AllocationMethod, { name: string; share: number }[]> = {
  piramida: [
    { name: 'Kebutuhan Pokok', share: 0.5 },
    { name: 'Proteksi', share: 0.1 },
    { name: 'Tabungan & Investasi', share: 0.3 },
    { name: 'Dana Pensiun/Warisan', share: 0.1 },
  ],
  '3stage': [
    { name: 'Living (Kebutuhan)', share: 0.5 },
    { name: 'Saving (Tabungan)', share: 0.2 },
    { name: 'Playing (Keinginan)', share: 0.3 },
  ],
};

export const METHOD_LABELS: Record<AllocationMethod, string> = {
  piramida: 'Piramida keuangan (4 lapis)',
  '3stage': '3 Stage — Living / Saving / Playing (50/20/30)',
};
