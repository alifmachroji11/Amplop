import Link from 'next/link';
import { PhoneShell } from '@/components/ui/PhoneShell';
import { HomeMenu } from '@/components/home/HomeMenu';
import { HeroInteractive } from '@/components/landing/HeroInteractive';
import { WhyAmplop } from '@/components/landing/WhyAmplop';
import { Button } from '@/components/ui/Button';
import { getAuthUser } from '@/lib/supabase/authServer';

export default async function LandingPage() {
  const user = await getAuthUser();

  if (user) {
    const name = (user.user_metadata?.name as string | undefined) ?? null;
    return (
      <PhoneShell active="home">
        <HomeMenu name={name} />
      </PhoneShell>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            color: 'var(--color-border)',
            maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full bg-sage-tint blur-[110px] lg:right-[8%]"
        />

        <div className="relative mx-auto flex max-w-[1160px] flex-col px-5 pt-16 pb-4 sm:px-8 lg:px-16 lg:pt-24">
          <div className="mb-6 flex animate-fade-up items-center gap-3">
            <span className="font-serif text-[15px] tracking-[0.08em] text-sage uppercase">Jejak</span>
            <span aria-hidden className="h-px w-10 border-t border-dashed border-sage/50" />
            <span className="text-[12px] tracking-[0.08em] text-ink-faint uppercase">oleh Amplop</span>
          </div>

          <h1
            className="mb-6 max-w-[760px] animate-fade-up font-serif text-[42px] leading-[1.08] font-medium text-ink lg:text-[76px]"
            style={{ animationDelay: '80ms' }}
          >
            <span className="italic text-sage-ink">Nggak perlu</span>
            <br />
            catat manual lagi.
          </h1>
          <p
            className="mb-14 max-w-[480px] animate-fade-up text-base leading-relaxed text-ink-soft lg:text-lg"
            style={{ animationDelay: '160ms' }}
          >
            Kamu pasti punya banyak screenshot bukti transfer atau pembayaran yang
            numpuk di galeri HP. Unggah aja semuanya — kami yang baca dan susun
            jadi cerita keuanganmu.
          </p>

          <div className="animate-fade-up" style={{ animationDelay: '240ms' }}>
            <HeroInteractive />
          </div>

          <div className="mt-14 animate-fade-up lg:mt-16" style={{ animationDelay: '320ms' }}>
            <Link href="/auth/login" className="group block sm:inline-block">
              <Button className="w-full sm:w-auto sm:px-10">
                <span className="inline-flex items-center gap-2">
                  Masuk dengan Google
                  <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Button>
            </Link>
            <div className="mt-3.5 text-[13px] text-ink-faint">
              Datamu aman, tersimpan di akun Google-mu — bisa dibuka lagi dari HP
              atau laptop mana pun.
            </div>
          </div>
        </div>
      </div>

      <WhyAmplop />

      <div className="mx-auto max-w-[1160px] px-5 pb-10 text-center sm:px-8 lg:px-16">
        <Link href="/privasi" className="text-[13px] text-ink-faint underline">
          Kebijakan Privasi
        </Link>
      </div>
    </div>
  );
}
