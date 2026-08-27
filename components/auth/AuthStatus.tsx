import { getAuthUser } from '@/lib/supabase/authServer';
import { LogoutButton } from './LogoutButton';

export async function AuthStatus() {
  const user = await getAuthUser();
  return (
    <div className="flex items-center justify-end gap-3 px-6 pt-3 text-[12px] text-ink-faint">
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
  );
}
