import Link from 'next/link';
import type { Metadata } from 'next';
import { getAuthUser } from '@/lib/supabase/authServer';
import { DeleteAccountButton } from '@/components/privacy/DeleteAccountButton';

export const metadata: Metadata = { title: 'Kebijakan Privasi — Amplop' };

export default async function PrivacyPage() {
  const user = await getAuthUser();

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-[720px] px-5 pt-14 pb-20 sm:px-8">
        <Link
          href="/"
          className="mb-8 inline-block font-serif text-[15px] tracking-[0.08em] text-sage uppercase"
        >
          Jejak
        </Link>
        <h1 className="mb-2 font-serif text-[32px] text-ink">Kebijakan Privasi</h1>
        <p className="mb-10 text-[13px] text-ink-faint">Berlaku sejak 29 Agustus 2026</p>

        <div className="flex flex-col gap-8 text-[15px] leading-relaxed text-ink-soft">
          <section>
            <h2 className="mb-2 text-base font-semibold text-ink">Data apa yang kami kumpulkan</h2>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Nama dan email dari akun Google kamu, saat kamu login.</li>
              <li>Screenshot bukti transfer/pembayaran yang kamu unggah.</li>
              <li>Data transaksi hasil baca screenshot: merchant, tanggal, nominal, kategori.</li>
              <li>Data pemasukan yang kamu catat manual, termasuk alokasi budget-nya.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-ink">Kenapa data ini dikumpulkan</h2>
            <p>
              Semata buat menjalankan fitur inti Amplop: baca isi screenshot, susun jadi cerita
              keuangan mingguan, dan biarkan kamu koreksi atau tinjau ulang kapan saja. Kami gak
              menjual atau membagikan datamu ke pihak ketiga untuk keperluan iklan.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-ink">Pihak ketiga yang memproses data</h2>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-ink">Google (Sign-In)</strong> — buat proses login, kami
                cuma terima nama dan email dari akun Google-mu.
              </li>
              <li>
                <strong className="text-ink">Supabase</strong> — database dan penyimpanan file
                yang kami pakai, berlokasi di Singapura.
              </li>
              <li>
                <strong className="text-ink">Google Gemini API</strong> — screenshot yang kamu
                unggah dikirim ke sini buat dibaca otomatis. Amplop saat ini pakai tingkat gratis
                (API key dari Google AI Studio), yang berdasarkan kebijakan publik Google
                memungkinkan konten yang dikirim dipakai buat pengembangan produk mereka — beda
                dari tingkat berbayar yang punya jaminan privasi lebih ketat. Kalau ini jadi
                perhatian buatmu, hindari unggah screenshot yang menampilkan info sensitif di luar
                data transaksi (misalnya nomor rekening penuh).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-ink">Berapa lama data disimpan</h2>
            <p>
              Selama akunmu masih aktif. Kamu bisa hapus transaksi satu per satu kapan saja dari
              halaman Cerita, atau hapus semua data sekaligus lewat tombol di bagian bawah halaman
              ini.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-ink">Keamanan</h2>
            <p>
              Akses ke database dan file cuma lewat server kami — gak ada akses langsung dari
              browser. Setiap permintaan data wajib login, dan data tiap akun dipisah ketat satu
              sama lain.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-ink">Hak kamu</h2>
            <p>
              Kamu berhak lihat, koreksi, dan hapus datamu kapan saja. Ada pertanyaan? Hubungi{' '}
              <a href="mailto:alifmachroji11@gmail.com" className="text-sage underline">
                alifmachroji11@gmail.com
              </a>
              .
            </p>
          </section>

          {user && (
            <section>
              <h2 className="mb-2 text-base font-semibold text-ink">Hapus akun & semua data</h2>
              <p className="mb-4">
                Ini akan menghapus semua transaksi, screenshot, dan riwayat pemasukanmu secara
                permanen, lalu mengeluarkanmu dari akun.
              </p>
              <DeleteAccountButton />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
