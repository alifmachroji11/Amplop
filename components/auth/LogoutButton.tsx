'use client';

import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabaseBrowser().auth.signOut();
    router.refresh();
  }

  return (
    <button onClick={handleLogout} className="underline underline-offset-2 text-ink-faint">
      Keluar
    </button>
  );
}
