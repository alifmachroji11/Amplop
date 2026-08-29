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
    <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-10">
      <div className="relative flex flex-col">
        {/* The dashed thread is the one signature motif of the page — Amplop's wordmark is
            "Jejak" (trace/trail), so the steps you follow to get there are drawn as a literal
            trail rather than a plain numbered list. */}
        <div
          aria-hidden
          className="absolute top-[34px] bottom-[34px] left-[16.5px] w-px border-l border-dashed border-sage/40"
        />
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            onMouseEnter={() => setHoveredFrame(i)}
            onMouseLeave={() => setHoveredFrame(null)}
            className="relative flex gap-4 rounded-card px-3 py-4"
          >
            <div
              className={`relative z-10 flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full font-serif text-[15px] transition-all duration-300 ${
                active === i
                  ? 'scale-110 bg-sage text-white shadow-[0_6px_16px_-4px_rgba(92,107,82,0.5)]'
                  : 'bg-surface text-sage-ink ring-1 ring-border'
              }`}
            >
              {i + 1}
            </div>
            <div className="pt-1.5">
              <div
                className={`mb-0.5 text-[15px] font-semibold transition-colors duration-300 ${
                  active === i ? 'text-ink' : 'text-ink-soft'
                }`}
              >
                {step.title}
              </div>
              <div className="text-sm leading-snug text-ink-faint">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:mt-6 lg:justify-self-end">
        <DemoCard frame={active} />
      </div>
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
          <div key={i} className="relative aspect-square rounded-card bg-sage-tint-2">
            <div className="absolute right-1.5 bottom-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-sage">
              <div className="h-[6px] w-[3px] -translate-y-px rotate-45 border-r-2 border-b-2 border-white" />
            </div>
          </div>
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
      <div className="relative h-20 overflow-hidden rounded-card bg-surface-muted ring-1 ring-border">
        <div className="flex h-full flex-col items-center justify-center gap-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-income-bg">
            <div className="h-2.5 w-1.5 -translate-y-px rotate-45 border-r-2 border-b-2 border-income-text" />
          </div>
          <div className="text-[11px] font-medium text-ink-soft">Transfer Berhasil</div>
        </div>
        {/* Remounted (via the `active` key) each time this frame comes back into view, so the
            scan sweep replays as a short, finite pass rather than looping forever — it should
            read as "done reading," not as a stuck loading state. */}
        {active && (
          <div
            key="scan"
            className="absolute inset-x-0 top-0 h-8 animate-[scan-sweep_1.3s_ease-in-out_2_forwards] bg-gradient-to-b from-transparent via-sage/50 to-transparent"
          />
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
