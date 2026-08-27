import Link from 'next/link';
import { PhoneShell } from '@/components/ui/PhoneShell';
import { Button } from '@/components/ui/Button';
import { StepItem } from '@/components/landing/StepItem';

const STEPS = [
  { n: '1', title: 'Unggah screenshot', desc: 'Ambil dari galeri: bukti transfer, notifikasi e-wallet, atau m-banking.' },
  { n: '2', title: 'Kami baca isinya', desc: 'Nominal, tanggal, dan jenis transaksinya kami susun otomatis.' },
  { n: '3', title: 'Kamu tinggal baca', desc: 'Hasilnya jadi cerita mingguan yang gampang dipahami, bukan tabel angka.' },
];

export default function LandingPage() {
  return (
    <PhoneShell>
      <div className="flex min-h-[800px] flex-col justify-between px-7 pt-14 pb-10">
        <div>
          <div className="mb-9 font-serif text-[15px] tracking-[0.08em] text-sage uppercase">
            Jejak
          </div>
          <h1 className="mb-5 font-serif text-[38px] font-medium leading-tight text-ink">
            Nggak perlu
            <br />
            catat manual lagi.
          </h1>
          <p className="mb-9 text-base leading-relaxed text-ink-soft">
            Kamu pasti punya banyak screenshot bukti transfer atau pembayaran yang
            numpuk di galeri HP. Unggah aja semuanya — kami yang baca dan susun
            jadi cerita keuanganmu.
          </p>

          <div className="mb-2 flex flex-col">
            {STEPS.map((s) => (
              <StepItem key={s.n} {...s} />
            ))}
          </div>
        </div>

        <div>
          <Link href="/upload" className="block">
            <Button className="w-full">Mulai unggah screenshot</Button>
          </Link>
          <div className="mt-3.5 text-center text-[13px] text-ink-faint">
            Datamu aman, semua diproses langsung di HP kamu.
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}
