import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatRupiah, formatDateId } from './format';
import type { Transaction } from './types';

type AutoTableDoc = jsPDF & { lastAutoTable?: { finalY: number } };

export type StoryPdfInput = {
  dateRangeLabel: string;
  weekId: string;
  transactions: Transaction[];
  masukCents: number;
  keluarCents: number;
};

function categoryBreakdown(transactions: Transaction[]): { name: string; cents: number }[] {
  const totals = new Map<string, number>();
  for (const tx of transactions) {
    totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amount_cents);
  }
  return [...totals.entries()]
    .map(([name, cents]) => ({ name, cents }))
    .sort((a, b) => Math.abs(b.cents) - Math.abs(a.cents));
}

const RUPIAH_GREEN: [number, number, number] = [20, 110, 60];
const RUPIAH_RED: [number, number, number] = [160, 40, 30];

// jsPDF's built-in fonts (helvetica/times/courier) only support WinAnsi -- codepoints outside
// Latin-1 (accented/CJK/emoji, which can show up in a Gemini-OCR'd merchant name) silently
// render blank instead of erroring. A handful of "smart punctuation" code points above 0xFF
// (en/em dash, curly quotes, bullet, ellipsis, trademark) still render fine under WinAnsi, so
// those are allow-listed rather than treated as unsupported.
const PDF_SAFE_EXTRA_CODE_POINTS = new Set([
  0x2013, 0x2014, 0x2018, 0x2019, 0x201c, 0x201d, 0x2022, 0x2026, 0x2122,
]);
const COMBINING_MARK_MIN = 0x0300;
const COMBINING_MARK_MAX = 0x036f;

/**
 * Decompose accents down to plain Latin first (so an accented merchant name keeps reading
 * close to normal rather than turning into "?"), then fall back to "?" for any remaining
 * unsupported code point so the PDF degrades visibly instead of silently dropping characters.
 */
function safePdfText(s: string): string {
  let out = '';
  for (const ch of s.normalize('NFKD')) {
    const code = ch.codePointAt(0)!;
    if (code >= COMBINING_MARK_MIN && code <= COMBINING_MARK_MAX) continue;
    out += code <= 0xff || PDF_SAFE_EXTRA_CODE_POINTS.has(code) ? ch : '?';
  }
  return out;
}

export function buildStoryPdf({ dateRangeLabel, transactions, masukCents, keluarCents }: StoryPdfInput): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' }) as AutoTableDoc;
  const marginX = 40;
  let y = 50;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Amplop - Cerita Keuangan', marginX, y);

  y += 22;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(90);
  doc.text(`Periode ${dateRangeLabel}`, marginX, y);
  doc.setTextColor(0);

  y += 34;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Ringkasan', marginX, y);

  y += 20;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...RUPIAH_GREEN);
  doc.text(`Pemasukan: Rp${(masukCents / 100).toLocaleString('id-ID')}`, marginX, y);
  doc.setTextColor(...RUPIAH_RED);
  doc.text(`Pengeluaran: Rp${(keluarCents / 100).toLocaleString('id-ID')}`, marginX + 220, y);
  doc.setTextColor(0);

  y += 18;
  doc.setFont('helvetica', 'bold');
  doc.text(`Selisih: ${formatRupiah((masukCents - keluarCents) / 100)}`, marginX, y);

  y += 28;

  const breakdown = categoryBreakdown(transactions);
  if (breakdown.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Per Kategori', marginX, y);
    y += 10;

    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      head: [['Kategori', 'Jumlah']],
      body: breakdown.map((c) => [c.name, formatRupiah(c.cents / 100)]),
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 6 },
      headStyles: { fillColor: [90, 120, 90], textColor: 255 },
      columnStyles: { 1: { halign: 'right' } },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 1) {
          const raw = breakdown[data.row.index]?.cents ?? 0;
          data.cell.styles.textColor = raw < 0 ? RUPIAH_RED : RUPIAH_GREEN;
        }
      },
    });

    y = (doc.lastAutoTable?.finalY ?? y) + 30;
  }

  const sorted = [...transactions].sort((a, b) => a.occurred_at.localeCompare(b.occurred_at));

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Rincian Transaksi', marginX, y);
  y += 10;

  if (sorted.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text('Belum ada transaksi tercatat pada periode ini.', marginX, y + 14);
    doc.setTextColor(0);
    drawFooter(doc, marginX, 1);
    return doc;
  }

  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    head: [['Tanggal', 'Merchant', 'Kategori', 'Jumlah']],
    body: sorted.map((tx) => [
      formatDateId(tx.occurred_at),
      safePdfText(tx.merchant),
      tx.category,
      formatRupiah(tx.amount_cents / 100),
    ]),
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 5 },
    headStyles: { fillColor: [90, 120, 90], textColor: 255 },
    columnStyles: { 3: { halign: 'right' } },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 3) {
        const raw = sorted[data.row.index]?.amount_cents ?? 0;
        data.cell.styles.textColor = raw < 0 ? RUPIAH_RED : RUPIAH_GREEN;
      }
    },
    didDrawPage: (data) => drawFooter(doc, marginX, data.pageNumber),
  });

  return doc;
}

function drawFooter(doc: jsPDF, marginX: number, pageNumber: number) {
  doc.setFontSize(8);
  doc.setTextColor(140);
  doc.text(
    `Dibuat otomatis oleh Amplop - halaman ${pageNumber}`,
    marginX,
    doc.internal.pageSize.getHeight() - 20
  );
  doc.setTextColor(0);
}

export async function shareOrDownloadPdf(doc: jsPDF, filename: string, shareText: string): Promise<void> {
  const blob = doc.output('blob');
  const file = new File([blob], filename, { type: 'application/pdf' });

  if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Cerita Keuangan Amplop', text: shareText });
      return;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
    }
  }

  downloadBlob(blob, filename);
}

/**
 * jsPDF's own doc.save() builds its download <a> without attaching it to the DOM before
 * dispatching the click -- some Chrome versions silently drop the download in that case.
 * Attaching-then-removing the anchor ourselves is the standard reliable workaround.
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
