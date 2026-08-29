import type { ThumbItem } from '@/lib/uploadTypes';
import { ThumbCell } from './ThumbCell';

export function ThumbGrid({
  items,
  onReplace,
}: {
  items: ThumbItem[];
  onReplace?: (id: string, file: File) => void;
}) {
  return (
    <div className="mb-5 grid grid-cols-4 gap-2 lg:grid-cols-6 lg:gap-3">
      {items.map((item) => (
        <ThumbCell
          key={item.id}
          item={item}
          onReplace={onReplace ? (file) => onReplace(item.id, file) : undefined}
        />
      ))}
    </div>
  );
}
