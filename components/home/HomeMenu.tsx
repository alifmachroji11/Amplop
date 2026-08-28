import Link from 'next/link';
import { Card } from '@/components/ui/Card';

const MENU = [
  {
    href: '/upload',
    title: 'Unggah screenshot',
    desc: 'Tambah bukti transfer atau notifikasi pembayaran baru.',
  },
  {
    href: '/story',
    title: 'Cerita minggu ini',
    desc: 'Lihat ringkasan keuanganmu minggu ini.',
  },
  {
    href: '/transactions',
    title: 'Semua transaksi',
    desc: 'Cek dan koreksi seluruh transaksi yang sudah terbaca.',
  },
  {
    href: '/kalender',
    title: 'Kalender',
    desc: 'Tinjau ulang cerita keuangan minggu-minggu sebelumnya.',
  },
];

export function HomeMenu({ name }: { name: string | null }) {
  return (
    <div className="min-h-[800px] px-6 pt-8 pb-10 lg:min-h-[520px] lg:px-11 lg:pt-11 lg:pb-11">
      <div className="mb-1.5 font-serif text-2xl text-ink lg:text-[28px]">
        Halo{name ? `, ${name}` : ''}.
      </div>
      <p className="mb-7 max-w-[480px] text-sm leading-relaxed text-ink-soft lg:text-base">
        Mau ngapain hari ini?
      </p>

      <div className="flex flex-col gap-3">
        {MENU.map((item) => (
          <Link key={item.href} href={item.href} className="block">
            <Card className="transition-colors hover:border-sage">
              <div className="mb-1 text-[16px] font-semibold text-ink">{item.title}</div>
              <div className="text-[13px] leading-relaxed text-ink-soft">{item.desc}</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
