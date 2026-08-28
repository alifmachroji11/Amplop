import Link from 'next/link';
import { getAuthUser } from '@/lib/supabase/authServer';
import { LogoutButton } from './LogoutButton';

export async function AuthStatus() {
  const user = await getAuthUser();
  return (
    <div className="flex items-center justify-between gap-3 px-6 pt-3 text-[12px] text-ink-faint">
      <Link href="/" className="font-serif text-[13px] tracking-[0.08em] text-sage uppercase">
        Jejak
      </Link>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="max-w-[160px] truncate">{user.email}</span>
            <LogoutButton />
          </>
        ) : (
          <a href="/auth/login" className="font-medium text-sage underline underline-offset-2">
            Masuk dengan Google
          </a>
        )}
      </div>
    </div>
  );
}
