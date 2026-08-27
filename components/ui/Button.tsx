import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary';

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base = 'rounded-pill text-[16px] font-semibold cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50';
  const styles =
    variant === 'primary'
      ? 'border-none bg-sage px-5 py-[18px] text-white'
      : 'border-[1.5px] border-ink-faint bg-transparent px-5 py-[14px] text-ink-soft';
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
