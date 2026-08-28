import Link from 'next/link';
import { Card } from '@/components/ui/Card';

const MENU = [
  {
    href: '/upload',
    title: 'Unggah screenshot',
    desc: 'Tambah bukti transfer atau notifikasi pembayaran baru.',
  },
  {
    href: '/pemasukan',
    title: 'Catat pemasukan',
    desc: 'Catat sumber pemasukan dan alokasikan ke kebutuhanmu.',
  },
  {
    href: '/story',
    title: 'Cerita & transaksi',
    desc: 'Lihat ringkasan minggu ini, atau cek dan koreksi seluruh transaksi.',
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
        {MENU.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            className="block animate-fade-up"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <Card className="hover:-translate-y-0.5 hover:border-sage hover:shadow-[0_14px_28px_-16px_rgba(92,107,82,0.45)]">
              <div className="mb-1 text-[16px] font-semibold text-ink">{item.title}</div>
              <div className="text-[13px] leading-relaxed text-ink-soft">{item.desc}</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
