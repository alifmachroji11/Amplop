import { CATEGORIES } from '@/lib/categories';

export function CategorySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-pill border border-ink-faint bg-sage-tint px-2.5 py-1.5 font-sans text-[13px] text-sage-ink"
    >
      {CATEGORIES.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}
