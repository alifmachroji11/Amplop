export function SummaryCard({ masukCents, keluarCents }: { masukCents: number; keluarCents: number }) {
  return (
    <div className="mb-6.5 flex gap-3">
      <div className="flex-1 rounded-card bg-income-bg px-4 py-4.5">
        <div className="mb-1.5 text-xs text-income-text">Masuk</div>
        <div className="font-serif text-[22px] text-income-text">
          Rp{(masukCents / 100).toLocaleString('id-ID')}
        </div>
      </div>
      <div className="flex-1 rounded-card bg-expense-bg px-4 py-4.5">
        <div className="mb-1.5 text-xs text-expense-text">Keluar</div>
        <div className="font-serif text-[22px] text-expense-text">
          Rp{(keluarCents / 100).toLocaleString('id-ID')}
        </div>
      </div>
    </div>
  );
}
