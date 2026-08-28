'use client';

import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

// Keep in sync with SESSION_COOKIE_NAME in lib/session.ts — can't import it directly here,
// that module pulls in next/headers which isn't allowed in a client component.
const SESSION_COOKIE_NAME = 'amplop_sid';

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabaseBrowser().auth.signOut();
    // Clear the anonymous session cookie too, so a shared/public device doesn't silently
    // link this browser's next login to whatever anonymous data piled up under it.
    document.cookie = `${SESSION_COOKIE_NAME}=; Max-Age=0; path=/; SameSite=Lax`;
    router.refresh();
  }

  return (
    <button onClick={handleLogout} className="underline underline-offset-2 text-ink-faint">
      Keluar
    </button>
  );
}
