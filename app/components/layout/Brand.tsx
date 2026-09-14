import { Link } from 'react-router';

import { SITE_NAME } from '~/lib/site.shared';
import { Logo } from '~/components/ui/Logo';
import { cn } from '~/lib/styles.shared';

interface BrandProps {
  className?: string;
  onNavigate?: () => void;
}

const LOGO = cn(
  'size-8 transition-[rotate,scale] duration-500 ease-expressive',
  'group-hover:-rotate-12 group-active:scale-90',
);

export function Brand({ className, onNavigate }: BrandProps) {
  return (
    <Link
      to="/"
      onClick={onNavigate}
      className={cn('group flex items-center gap-2.5 rounded-full py-1 pr-2', className)}
    >
      <Logo className={LOGO} />
      <span className="text-title-medium whitespace-nowrap">{SITE_NAME}</span>
    </Link>
  );
}
