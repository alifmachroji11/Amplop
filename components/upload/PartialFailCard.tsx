import { Button } from '@/components/ui/Button';

export function PartialFailCard({
  doneCount,
  total,
  onRetry,
  onSkip,
}: {
  doneCount: number;
  total: number;
  onRetry: () => void;
  onSkip: () => void;
}) {
  const failedCount = total - doneCount;
  return (
    <div>
      <div className="mb-4.5 rounded-card bg-expense-bg p-5">
        <div className="mb-1.5 text-[15px] font-semibold text-expense-text">
          {doneCount} dari {total} berhasil dibaca
        </div>
        <div className="text-sm leading-relaxed text-ink-soft">
          {failedCount} gambar terlalu buram sehingga belum bisa kami baca. Tidak
          masalah — kamu bisa unggah ulang yang buram, atau lewati saja dan
          lanjut lihat ceritamu.
        </div>
      </div>
      <div className="flex gap-2.5">
        <Button variant="secondary" className="flex-1 !py-3.5 !text-sm" onClick={onRetry}>
          Unggah ulang
        </Button>
        <Button className="flex-1 !py-3.5 !text-sm" onClick={onSkip}>
          Lewati, lanjut
        </Button>
      </div>
    </div>
  );
}
