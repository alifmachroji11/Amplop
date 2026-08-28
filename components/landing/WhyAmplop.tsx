const POINTS = [
  {
    title: 'Baca otomatis, semua e-wallet',
    desc: 'GoPay, OVO, DANA, BCA, QRIS, m-banking — tinggal upload, Amplop yang baca nominal dan jenis transaksinya.',
  },
  {
    title: 'Datamu cuma milikmu',
    desc: 'Tersimpan di akun Google-mu sendiri, gak ada yang bisa lihat selain kamu, bisa dibuka lagi dari HP atau laptop mana pun.',
  },
  {
    title: 'Tinjau ulang kapan saja',
    desc: 'Buka kalender, pilih minggu mana pun, atau bagikan cerita keuanganmu sebagai PDF.',
  },
];

export function WhyAmplop() {
  return (
    <section className="mx-auto w-full max-w-[900px] px-4 pt-20 pb-16 lg:px-16">
      <div className="mb-10 text-center">
        <div className="mb-2 font-serif text-[15px] tracking-[0.08em] text-sage uppercase">
          Kenapa Amplop
        </div>
        <h2 className="font-serif text-[28px] text-ink lg:text-[34px]">
          Dibuat biar kamu gak perlu mikir.
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {POINTS.map((point, i) => (
          <div
            key={point.title}
            className="animate-fade-up rounded-card border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-1 hover:border-sage hover:shadow-[0_16px_30px_-18px_rgba(92,107,82,0.45)]"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className="mb-3 font-serif text-2xl text-sage-ink">{String(i + 1).padStart(2, '0')}</div>
            <div className="mb-1.5 text-[15px] font-semibold text-ink">{point.title}</div>
            <div className="text-sm leading-relaxed text-ink-soft">{point.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
