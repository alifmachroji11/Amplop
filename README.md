# Amplop

Nggak perlu catat manual lagi. Amplop baca screenshot bukti transfer/e-wallet (GoPay, OVO, DANA, BCA, QRIS, m-banking, dll) dan nyusun jadi cerita keuangan mingguan yang gampang dibaca.

**Production:** https://amplop-green.vercel.app

## Cara kerja

1. **Unggah** — upload screenshot bukti transfer/notifikasi pembayaran dari galeri, sekaligus banyak.
2. **Baca** — Gemini vision baca merchant, nominal, tanggal, dan jenis transaksinya secara otomatis.
3. **Cerita** — hasilnya disusun jadi ringkasan mingguan (masuk/keluar), bukan tabel angka mentah.
4. **Koreksi** — kalau kategori atau datanya kurang pas, tinggal ketuk buat ubah.

Login Google wajib buat akses Unggah/Cerita/Transaksi (gerbang di `components/ui/PhoneShell.tsx`, belum login → diarahkan balik ke `/`). Landing punya dua wajah: belum login tampil pitch + tombol "Masuk dengan Google", sudah login langsung disambut Home menu (`components/home/HomeMenu.tsx`) buat milih Unggah/Cerita/Transaksi. Data tersimpan per akun (`user_id`), bukan lagi cuma session cookie — cookie sesi anonim (`amplop_sid`, `lib/session.ts`) masih ada di infra buat nge-link data lama, tapi gak lagi jadi identitas utama dari UI.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS 4**
- **Supabase** — Postgres (tabel `uploads`, `transactions`) + Storage (bucket `screenshots`)
- **Gemini** (`@google/genai`, model `gemini-3.6-flash`) — parsing screenshot ke data terstruktur, divalidasi pakai Zod

## Struktur halaman

| Route | Fungsi |
|---|---|
| `/` | Landing (belum login) / Home menu (sudah login) |
| `/auth/login` | Login Google |
| `/auth/callback` | OAuth callback + link data anonim lama ke akun |
| `/upload` | Unggah screenshot |
| `/pemasukan` | Catat pemasukan manual (sumber + alokasi Piramida/3 Stage) |
| `/story`, `/story/[weekId]` | Cerita keuangan mingguan, bisa dibagikan sebagai PDF |
| `/transactions` | Daftar transaksi + koreksi kategori |
| `/kalender` | Navigasi ke cerita minggu mana pun lewat kalender bulanan |

API internal: `app/api/upload`, `app/api/parse`, `app/api/transactions/[id]`, `app/api/income`.

## Setup lokal

1. Salin `.env.local.example` ke `.env.local`, isi:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` — dipakai server-only (`lib/supabase/server.ts`), jangan pernah diekspos ke browser
   - `GEMINI_API_KEY`
2. Jalankan semua migration di `supabase/migrations/` (berurutan) ke project Supabase kamu.
3. Install dependency dan jalankan dev server:

   ```bash
   npm install
   npm run dev
   ```

4. Buka [http://localhost:3000](http://localhost:3000).

## Catatan keamanan

Semua akses DB lewat server (`service_role` key), nggak ada client Supabase di browser. RLS aktif di `uploads` dan `transactions` tanpa policy — sengaja deny-all buat `anon`/`authenticated`, karena satu-satunya jalur akses yang sah adalah lewat API route server ini. API route (`app/api/upload`, `app/api/parse`, `app/api/transactions/[id]`) juga nolak request tanpa login (401) sebagai lapis kedua di depan RLS.
