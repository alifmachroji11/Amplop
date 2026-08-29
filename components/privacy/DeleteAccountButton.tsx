'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

type Step = 'idle' | 'confirming' | 'deleting' | 'error';

export function DeleteAccountButton() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('idle');

  async function handleDelete() {
    setStep('deleting');
    const res = await fetch('/api/account', { method: 'DELETE' });
    if (!res.ok) {
      setStep('error');
      return;
    }
    // The account row itself is already gone server-side; this just clears the browser's
    // now-dangling local session state.
    await supabaseBrowser().auth.signOut();
    document.cookie = 'amplop_sid=; Max-Age=0; path=/; SameSite=Lax';
    router.push('/');
    router.refresh();
  }

  if (step === 'confirming') {
    return (
      <div className="rounded-card border border-expense-text/30 bg-expense-bg p-4">
        <div className="mb-3 text-sm font-semibold text-expense-text">
          Yakin? Semua transaksi, screenshot, dan riwayat pemasukanmu akan dihapus permanen, lalu
          kamu akan keluar dari akun. Ini tidak bisa dibatalkan.
        </div>
        <div className="flex gap-2.5">
          <Button variant="secondary" className="!py-2.5 !text-sm" onClick={() => setStep('idle')}>
            Batal
          </Button>
          <button
            onClick={handleDelete}
            className="cursor-pointer rounded-pill border-none bg-expense-text px-5 py-2.5 text-sm font-semibold text-white"
          >
            Ya, hapus semua
          </button>
        </div>
      </div>
    );
  }

  if (step === 'deleting') {
    return <div className="text-sm text-ink-soft">Menghapus…</div>;
  }

  return (
    <div>
      <button
        onClick={() => setStep('confirming')}
        className="cursor-pointer rounded-pill border border-expense-text bg-transparent px-5 py-2.5 text-sm font-semibold text-expense-text"
      >
        Hapus akun & semua data
      </button>
      {step === 'error' && (
        <div className="mt-2 text-[13px] text-expense-text">Gagal menghapus, coba lagi.</div>
      )}
    </div>
  );
}
