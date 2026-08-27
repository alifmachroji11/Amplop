import type { ThumbItem } from '@/lib/uploadTypes';
import { ThumbCell } from './ThumbCell';

export function ThumbGrid({ items }: { items: ThumbItem[] }) {
  return (
    <div className="mb-5 grid grid-cols-4 gap-2">
      {items.map((item) => (
        <ThumbCell key={item.id} item={item} />
      ))}
    </div>
  );
}
