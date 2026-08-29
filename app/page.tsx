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
      <div className="mx-auto flex max-w-[1100px] flex-col px-5 pt-14 pb-4 sm:px-8 lg:px-16 lg:pt-20">
        <div className="mb-3 animate-fade-up font-serif text-[15px] tracking-[0.08em] text-sage uppercase">
          Jejak
        </div>
        <h1
          className="mb-5 max-w-[720px] animate-fade-up font-serif text-[38px] leading-tight font-medium text-ink lg:text-[56px]"
          style={{ animationDelay: '80ms' }}
        >
          Nggak perlu
          <br />
          catat manual lagi.
        </h1>
        <p
          className="mb-12 max-w-[520px] animate-fade-up text-base leading-relaxed text-ink-soft lg:text-lg"
          style={{ animationDelay: '160ms' }}
        >
          Kamu pasti punya banyak screenshot bukti transfer atau pembayaran yang
          numpuk di galeri HP. Unggah aja semuanya — kami yang baca dan susun
          jadi cerita keuanganmu.
        </p>

        <div className="animate-fade-up" style={{ animationDelay: '240ms' }}>
          <HeroInteractive />
        </div>

        <div className="mt-12 animate-fade-up lg:mt-14" style={{ animationDelay: '320ms' }}>
          <Link href="/auth/login" className="block sm:inline-block">
            <Button className="w-full sm:w-auto sm:px-10">Masuk dengan Google</Button>
          </Link>
          <div className="mt-3.5 text-[13px] text-ink-faint">
            Datamu aman, tersimpan di akun Google-mu — bisa dibuka lagi dari HP
            atau laptop mana pun.
          </div>
        </div>
      </div>

      <WhyAmplop />

      <div className="mx-auto max-w-[1100px] px-5 pb-10 text-center sm:px-8 lg:px-16">
        <Link href="/privasi" className="text-[13px] text-ink-faint underline">
          Kebijakan Privasi
        </Link>
      </div>
    </div>
  );
}
