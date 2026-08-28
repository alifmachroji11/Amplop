import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary';

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base =
    'rounded-pill text-[16px] font-semibold cursor-pointer transition-all duration-200 ease-out active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none';
  const styles =
    variant === 'primary'
      ? 'border-none bg-sage px-5 py-[18px] text-white shadow-[0_10px_24px_-12px_rgba(92,107,82,0.55)] hover:-translate-y-0.5 hover:bg-sage-ink hover:shadow-[0_14px_28px_-12px_rgba(92,107,82,0.6)]'
      : 'border-[1.5px] border-ink-faint bg-transparent px-5 py-[14px] text-ink-soft hover:-translate-y-0.5 hover:border-sage hover:text-sage-ink';
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
