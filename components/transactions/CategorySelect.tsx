import { CATEGORIES } from '@/lib/categories';

export function CategorySelect({
  value,
  isIncome,
  onChange,
}: {
  value: string;
  isIncome: boolean;
  onChange: (value: string) => void;
}) {
  // A transaction's sign says whether it's income or an expense — the category must agree,
  // otherwise the story/PDF math and narrative ("pengeluaran terbesarmu untuk Pemasukan") break.
  const options = isIncome ? (['Pemasukan'] as const) : CATEGORIES.filter((c) => c !== 'Pemasukan');

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-pill border border-ink-faint bg-sage-tint px-2.5 py-1.5 font-sans text-[13px] text-sage-ink"
    >
      {options.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}
