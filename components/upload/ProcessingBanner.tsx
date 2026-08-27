export function ProcessingBanner({ doneCount, total }: { doneCount: number; total: number }) {
  return (
    <div className="rounded-card bg-sage-tint-2 p-5 text-center">
      <div
        className="mb-1.5 font-serif text-base italic text-sage-ink"
        style={{ animation: 'pulse 2.2s ease-in-out infinite' }}
      >
        Sedang membaca screenshot kamu…
      </div>
      <div className="text-[13px] text-sage-ink">
        {doneCount} dari {total} sudah berhasil dibaca
      </div>
    </div>
  );
}
