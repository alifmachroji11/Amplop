'use client';

import { useRef, type DragEvent } from 'react';

export function Dropzone({ onFiles }: { onFiles: (files: FileList) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files);
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="cursor-pointer rounded-card border-2 border-dashed border-ink-faint bg-surface-muted px-5 py-13 text-center"
    >
      <div className="mx-auto mb-4.5 flex h-14 w-14 items-center justify-center rounded-full bg-sage-tint">
        <div className="mt-1.5 h-5 w-5 rotate-[135deg] border-b-2 border-l-2 border-sage-ink" />
      </div>
      <div className="mb-1.5 text-base font-semibold text-ink">
        Ketuk untuk pilih gambar dari galeri
      </div>
      <div className="text-[13px] text-ink-faint">atau tarik beberapa gambar ke area ini</div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && onFiles(e.target.files)}
      />
    </div>
  );
}
