# Amplop

Nggak perlu catat manual lagi. Amplop baca screenshot bukti transfer/e-wallet (GoPay, OVO, DANA, BCA, QRIS, m-banking, dll) dan nyusun jadi cerita keuangan mingguan yang gampang dibaca.

**Production:** https://amplop-green.vercel.app

## Cara kerja

1. **Unggah** — upload screenshot bukti transfer/notifikasi pembayaran dari galeri, sekaligus banyak.
2. **Baca** — Gemini vision baca merchant, nominal, tanggal, dan jenis transaksinya secara otomatis.
3. **Cerita** — hasilnya disusun jadi ringkasan mingguan (masuk/keluar), bukan tabel angka mentah.
4. **Koreksi** — kalau kategori atau datanya kurang pas, tinggal ketuk buat ubah.

Nggak ada login/akun — identitas user cuma session cookie anonim (`amplop_sid`, lihat `lib/session.ts`), jadi data terikat ke browser tempat upload dilakukan.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS 4**
- **Supabase** — Postgres (tabel `uploads`, `transactions`) + Storage (bucket `screenshots`)
- **Gemini** (`@google/genai`, model `gemini-3.6-flash`) — parsing screenshot ke data terstruktur, divalidasi pakai Zod

## Struktur halaman

| Route | Fungsi |
|---|---|
| `/` | Landing |
| `/upload` | Unggah screenshot |
| `/story`, `/story/[weekId]` | Cerita keuangan mingguan |
| `/transactions` | Daftar transaksi + koreksi kategori |

API internal: `app/api/upload`, `app/api/parse`, `app/api/transactions/[id]`.

## Setup lokal

1. Salin `.env.local.example` ke `.env.local`, isi:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` — dipakai server-only (`lib/supabase/server.ts`), jangan pernah diekspos ke browser
   - `GEMINI_API_KEY`
2. Jalankan migration `supabase/migrations/0001_init.sql` ke project Supabase kamu.
3. Install dependency dan jalankan dev server:

   ```bash
   npm install
   npm run dev
   ```

4. Buka [http://localhost:3000](http://localhost:3000).

## Catatan keamanan

Semua akses DB lewat server (`service_role` key), nggak ada client Supabase di browser. RLS aktif di `uploads` dan `transactions` tanpa policy — sengaja deny-all buat `anon`/`authenticated`, karena satu-satunya jalur akses yang sah adalah lewat API route server ini.
