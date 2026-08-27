export function StoryHeader({ dateRange }: { dateRange: string }) {
  return (
    <div>
      <div className="mb-1 font-serif text-sm uppercase tracking-[0.06em] text-sage">
        Cerita minggu ini
      </div>
      <div className="mb-6.5 text-[13px] text-ink-faint">{dateRange}</div>
    </div>
  );
}
