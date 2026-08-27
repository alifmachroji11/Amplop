export function StepItem({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="flex gap-4 border-t border-border py-4">
      <div className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-sage-tint font-serif text-[15px] text-sage-ink">
        {n}
      </div>
      <div>
        <div className="mb-0.5 text-[15px] font-semibold text-ink">{title}</div>
        <div className="text-sm leading-snug text-ink-soft">{desc}</div>
      </div>
    </div>
  );
}
