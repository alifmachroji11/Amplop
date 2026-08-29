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

/**
 * A printed receipt, not an app-screen mockup — "Amplop" is an envelope you keep receipts in,
 * so the demo visual is one, complete with a dashed tear line and a barcode. It also sidesteps
 * the earlier problem entirely: a still, printed slip has no "is this loading?" reading to begin
 * with, since nothing here is pretending to be a live, animating interface.
 */
function DemoCard({ frame }: { frame: number }) {
  return (
    <div className="relative mx-auto w-full max-w-[300px] lg:mx-0 lg:w-[300px] lg:flex-shrink-0">
      <div
        aria-hidden
        className="absolute -top-10 -right-10 h-56 w-56 rounded-full bg-sage-tint blur-3xl"
      />
      <div className="group relative">
        <div className="absolute top-4 -right-3 h-full w-full rotate-2 rounded-card bg-sage-tint-2 shadow-phone transition-transform duration-500 ease-out group-hover:rotate-1" />
        <div className="relative -rotate-1 rounded-card bg-surface px-6 pt-7 pb-6 font-mono shadow-phone transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-0">
          <div className="text-center font-serif text-[13px] tracking-[0.15em] text-sage-ink uppercase">
            Amplop
          </div>
          <div className="mb-4 text-center text-[10px] tracking-[0.1em] text-ink-faint">
            jejak transaksi
          </div>
          <div className="border-t border-dashed border-border" />

          <div className="relative min-h-[168px] py-4">
            <ReceiptShell active={frame === 0}>
              <ReceiptUpload />
            </ReceiptShell>
            <ReceiptShell active={frame === 1}>
              <ReceiptRead />
            </ReceiptShell>
            <ReceiptShell active={frame === 2}>
              <ReceiptStory />
            </ReceiptShell>
          </div>

          <div className="border-t border-dashed border-border" />
          <div
            aria-hidden
            className="mt-4 h-5"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, var(--color-ink) 0px, var(--color-ink) 2px, transparent 2px, transparent 5px)',
            }}
          />
          <div className="mt-1.5 text-center text-[9px] tracking-[0.2em] text-ink-faint">
            NO. 0472 8831
          </div>
        </div>
      </div>
    </div>
  );
}

function ReceiptShell({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`absolute inset-0 transition-all duration-500 ${
        active ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      {children}
    </div>
  );
}

function ReceiptUpload() {
  return (
    <div>
      <div className="mb-2 text-[10px] tracking-wide text-ink-faint uppercase">Foto diterima · 3</div>
      {['IMG_0231.jpg', 'IMG_0244.jpg', 'IMG_0198.jpg'].map((name) => (
        <div key={name} className="flex items-center justify-between py-1 text-[12px]">
          <span className="text-ink-soft">{name}</span>
          <span className="text-sage-ink">OK</span>
        </div>
      ))}
      <div className="mt-3 text-[11px] text-ink-faint">Siap diproses.</div>
    </div>
  );
}

function ReceiptRead() {
  return (
    <div>
      <div className="mb-2 text-[10px] tracking-wide text-ink-faint uppercase">Terbaca otomatis</div>
      <div className="text-[14px] font-semibold text-ink">GoPay · Transfer</div>
      <div className="mt-1.5 flex items-center justify-between text-[13px]">
        <span className="text-ink-soft">Warung Bu Siti</span>
        <span className="font-medium text-ink">Rp75.000</span>
      </div>
      <div className="mt-1 text-[11px] text-ink-faint">Kategori: Makan & jajan</div>
    </div>
  );
}

function ReceiptStory() {
  return (
    <div>
      <div className="mb-2 text-[10px] tracking-wide text-ink-faint uppercase">
        Cerita minggu ini · 24–30 Agu
      </div>
      <div className="flex items-center justify-between py-1 text-[13px]">
        <span className="text-ink-soft">Masuk</span>
        <span className="font-medium text-income-text">Rp1.200.000</span>
      </div>
      <div className="flex items-center justify-between py-1 text-[13px]">
        <span className="text-ink-soft">Keluar</span>
        <span className="font-medium text-expense-text">Rp450.000</span>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-dashed border-border pt-2 text-[13px] font-semibold">
        <span className="text-ink">Sisa</span>
        <span className="text-ink">Rp750.000</span>
      </div>
    </div>
  );
}
