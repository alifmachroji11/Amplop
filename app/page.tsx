import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { StepItem } from '@/components/landing/StepItem';
import { getAuthUser } from '@/lib/supabase/authServer';

const STEPS = [
  { n: '1', title: 'Unggah screenshot', desc: 'Ambil dari galeri: bukti transfer, notifikasi e-wallet, atau m-banking.' },
  { n: '2', title: 'Kami baca isinya', desc: 'Nominal, tanggal, dan jenis transaksinya kami susun otomatis.' },
  { n: '3', title: 'Kamu tinggal baca', desc: 'Hasilnya jadi cerita mingguan yang gampang dipahami, bukan tabel angka.' },
];

export default async function LandingPage() {
  const user = await getAuthUser();
  if (user) redirect('/story');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 py-10 lg:flex-row lg:justify-center lg:gap-20 lg:px-16">
      <div className="relative w-full max-w-[414px] overflow-hidden rounded-phone bg-surface px-7 pt-14 pb-10 shadow-phone lg:max-w-[440px] lg:rounded-none lg:bg-transparent lg:px-0 lg:pt-0 lg:pb-0 lg:shadow-none">
        <div className="flex min-h-[800px] flex-col justify-between lg:min-h-0 lg:justify-normal lg:gap-10">
          <div>
            <div className="mb-9 font-serif text-[15px] tracking-[0.08em] text-sage uppercase">
              Jejak
            </div>
            <h1 className="mb-5 font-serif text-[38px] leading-tight font-medium text-ink lg:text-[52px]">
              Nggak perlu
              <br />
              catat manual lagi.
            </h1>
            <p className="mb-9 text-base leading-relaxed text-ink-soft lg:text-lg">
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
            <Link href="/upload" className="block lg:inline-block">
              <Button className="w-full lg:w-auto lg:px-10">Mulai unggah screenshot</Button>
            </Link>
            <div className="mt-3.5 text-[13px] text-ink-faint lg:mt-4">
              Datamu aman, semua diproses langsung di HP kamu.
              <br />
              Sudah pakai Amplop di HP lain?{' '}
              <a href="/auth/login" className="font-medium text-sage underline underline-offset-2">
                Masuk dengan Google
              </a>{' '}
              biar datanya nyambung.
            </div>
          </div>
        </div>
      </div>

      <div className="relative hidden w-[380px] flex-shrink-0 lg:block">
        <div
          className="absolute top-8 -right-6 w-[300px] rotate-[4deg] rounded-phone bg-sage-tint-2 shadow-phone"
          style={{ height: '380px' }}
        />
        <div className="relative rotate-[-3deg] rounded-phone bg-surface px-6 py-7 shadow-phone">
          <div className="mb-1 text-[11px] tracking-wide text-ink-faint uppercase">
            Cerita minggu ini
          </div>
          <div className="mb-5 font-serif text-lg text-ink">24–30 Agu</div>
          <p className="mb-6 font-serif text-[17px] leading-relaxed text-ink">
            Minggu ini pengeluaranmu paling banyak di awal minggu, lalu mulai menurun
            menjelang akhir pekan.
          </p>
          <div className="flex gap-3">
            <div className="flex-1 rounded-card bg-income-bg px-4 py-3.5">
              <div className="mb-1 text-[11px] text-income-text">Masuk</div>
              <div className="font-serif text-lg text-income-text">Rp1.200.000</div>
            </div>
            <div className="flex-1 rounded-card bg-expense-bg px-4 py-3.5">
              <div className="mb-1 text-[11px] text-expense-text">Keluar</div>
              <div className="font-serif text-lg text-expense-text">Rp450.000</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
