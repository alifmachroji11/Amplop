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
    <section className="mx-auto w-full max-w-[1160px] px-5 pt-24 pb-20 sm:px-8 lg:px-16">
      <div className="mb-14 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 font-serif text-[15px] tracking-[0.08em] text-sage uppercase">
            Kenapa Amplop
          </div>
          <h2 className="max-w-[440px] font-serif text-[32px] leading-[1.15] text-ink lg:text-[42px]">
            Dibuat biar kamu gak perlu mikir.
          </h2>
        </div>
        <p className="max-w-[320px] text-sm leading-relaxed text-ink-faint">
          Tiga hal yang kami pegang teguh setiap kali nambah fitur baru.
        </p>
      </div>

      <div className="flex flex-col">
        {POINTS.map((point, i) => (
          <div
            key={point.title}
            className="group animate-fade-up grid grid-cols-[auto_1fr] items-start gap-6 border-t border-border py-8 transition-colors first:border-t-0 hover:bg-surface/60 sm:grid-cols-[120px_1fr] sm:gap-10 sm:py-10"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className="font-serif text-4xl leading-none text-border transition-colors duration-300 group-hover:text-sage-tint-2 sm:text-6xl">
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="max-w-[560px] pt-1 sm:pt-3">
              <div className="mb-2 font-serif text-xl text-ink sm:text-2xl">{point.title}</div>
              <div className="text-[15px] leading-relaxed text-ink-soft">{point.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
