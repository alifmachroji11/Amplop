import Link from 'next/link';
import { LogoutButton } from '@/components/auth/LogoutButton';
import type { NavKey } from './navKeys';

const NAV: { key: NavKey; href: string; label: string }[] = [
  { key: 'home', href: '/', label: 'Beranda' },
  { key: 'upload', href: '/upload', label: 'Unggah' },
  { key: 'pemasukan', href: '/pemasukan', label: 'Pemasukan' },
  { key: 'story', href: '/story', label: 'Cerita' },
  { key: 'kalender', href: '/kalender', label: 'Kalender' },
];

export function Sidebar({
  active,
  email,
  masukCents,
  keluarCents,
}: {
  active: NavKey;
  email: string | null;
  masukCents: number;
  keluarCents: number;
}) {
  return (
    <aside className="sticky top-16 hidden w-[248px] flex-shrink-0 flex-col justify-between self-start py-1 lg:flex" style={{ minHeight: '520px' }}>
      <div>
        <Link href="/" className="mb-10 block pl-3 font-serif text-[15px] tracking-[0.08em] text-sage uppercase">
          Jejak
        </Link>
        <nav className="flex flex-col gap-0.5">
          {NAV.map((item) => {
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`relative rounded-card py-2.5 pl-3 text-[15px] transition-colors ${
                  isActive ? 'font-semibold text-ink' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {isActive && (
                  <span className="absolute top-1/2 -left-0 h-4 w-[3px] -translate-y-1/2 rounded-full bg-sage" />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <div className="mb-5 rounded-card border border-border px-4 py-4">
          <div className="mb-2.5 text-[11px] tracking-wide text-ink-faint uppercase">
            Ringkasan minggu ini
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] text-income-text">Masuk</span>
            <span className="font-serif text-[15px] text-income-text">
              Rp{(masukCents / 100).toLocaleString('id-ID')}
            </span>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-[13px] text-expense-text">Keluar</span>
            <span className="font-serif text-[15px] text-expense-text">
              Rp{(keluarCents / 100).toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4 pl-3 text-[12px] text-ink-faint">
          {email ? (
            <>
              <span className="max-w-[130px] truncate">{email}</span>
              <LogoutButton />
            </>
          ) : (
            <a href="/auth/login" className="font-medium text-sage underline underline-offset-2">
              Masuk dengan Google
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}
