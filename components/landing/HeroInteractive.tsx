'use client';

import { useEffect, useState } from 'react';

const STEPS = [
  {
    title: 'Unggah screenshot',
    desc: 'Ambil dari galeri: bukti transfer, notifikasi e-wallet, atau m-banking.',
  },
  {
    title: 'Kami baca isinya',
    desc: 'Nominal, tanggal, dan jenis transaksinya kami susun otomatis.',
  },
  {
    title: 'Kamu tinggal baca',
    desc: 'Hasilnya jadi cerita mingguan yang gampang dipahami, bukan tabel angka.',
  },
];

const AUTO_ADVANCE_MS = 3200;

export function HeroInteractive() {
  const [autoFrame, setAutoFrame] = useState(0);
  const [hoveredFrame, setHoveredFrame] = useState<number | null>(null);

  useEffect(() => {
    if (hoveredFrame !== null) return;
    const id = setInterval(() => setAutoFrame((f) => (f + 1) % STEPS.length), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [hoveredFrame]);

  const active = hoveredFrame ?? autoFrame;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-14">
      <div className="flex flex-col">
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            onMouseEnter={() => setHoveredFrame(i)}
            onMouseLeave={() => setHoveredFrame(null)}
            className={`flex gap-4 rounded-card border-t border-border px-3 py-4 transition-colors first:border-t-0 ${
              active === i ? 'bg-sage-tint/50' : ''
            }`}
          >
            <div
              className={`flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full font-serif text-[15px] transition-colors duration-300 ${
                active === i ? 'bg-sage text-white' : 'bg-sage-tint text-sage-ink'
              }`}
            >
              {i + 1}
            </div>
            <div>
              <div className="mb-0.5 text-[15px] font-semibold text-ink">{step.title}</div>
              <div className="text-sm leading-snug text-ink-soft">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <DemoCard frame={active} />
    </div>
  );
}

function DemoCard({ frame }: { frame: number }) {
  return (
    <div className="relative mx-auto w-full max-w-[340px] lg:mx-0 lg:w-[400px] lg:flex-shrink-0">
      <div
        aria-hidden
        className="absolute -top-10 -right-10 h-56 w-56 rounded-full bg-sage-tint blur-3xl"
      />
      <div className="group relative">
        <div className="absolute top-6 -right-4 h-[300px] w-full rotate-3 rounded-phone bg-sage-tint-2 shadow-phone transition-transform duration-500 ease-out group-hover:rotate-1" />
        <div className="relative h-[300px] -rotate-2 overflow-hidden rounded-phone bg-surface shadow-phone transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-0">
          <FrameUpload active={frame === 0} />
          <FrameParse active={frame === 1} />
          <FrameStory active={frame === 2} />
        </div>
      </div>
    </div>
  );
}

function FrameShell({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`absolute inset-6 flex flex-col justify-between transition-all duration-500 ${
        active ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      {children}
    </div>
  );
}

function FrameUpload({ active }: { active: boolean }) {
  return (
    <FrameShell active={active}>
      <div>
        <div className="mb-1 text-[11px] tracking-wide text-ink-faint uppercase">Galeri kamu</div>
        <div className="font-serif text-lg text-ink">3 screenshot dipilih</div>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-card bg-sage-tint-2"
            style={{ animationDelay: `${i * 180}ms` }}
          />
        ))}
      </div>
      <div className="text-sm text-ink-soft">Tinggal ketuk unggah, sisanya kami yang urus.</div>
    </FrameShell>
  );
}

function FrameParse({ active }: { active: boolean }) {
  return (
    <FrameShell active={active}>
      <div>
        <div className="mb-1 text-[11px] tracking-wide text-ink-faint uppercase">Membaca…</div>
        <div className="font-serif text-lg text-ink">GoPay · Transfer</div>
      </div>
      <div className="relative h-20 overflow-hidden rounded-card bg-sage-tint-2">
        {active && (
          <div className="absolute inset-x-0 top-0 h-8 animate-[scan-sweep_1.8s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-sage/50 to-transparent" />
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {['Rp75.000', 'Warung Bu Siti', 'Makan & jajan'].map((chip) => (
          <span key={chip} className="rounded-pill bg-surface-muted px-2.5 py-1 text-[11px] text-ink-soft">
            {chip}
          </span>
        ))}
      </div>
    </FrameShell>
  );
}

function FrameStory({ active }: { active: boolean }) {
  return (
    <FrameShell active={active}>
      <div>
        <div className="mb-1 text-[11px] tracking-wide text-ink-faint uppercase">Cerita minggu ini</div>
        <div className="font-serif text-lg text-ink">24–30 Agu</div>
      </div>
      <p className="font-serif text-[15px] leading-relaxed text-ink">
        Pengeluaranmu paling banyak di awal minggu, lalu mulai menurun.
      </p>
      <div className="flex gap-2.5">
        <div className="flex-1 rounded-card bg-income-bg px-3 py-3">
          <div className="text-[10px] text-income-text">Masuk</div>
          <div className="font-serif text-base text-income-text">Rp1.200.000</div>
        </div>
        <div className="flex-1 rounded-card bg-expense-bg px-3 py-3">
          <div className="text-[10px] text-expense-text">Keluar</div>
          <div className="font-serif text-base text-expense-text">Rp450.000</div>
        </div>
      </div>
    </FrameShell>
  );
}
