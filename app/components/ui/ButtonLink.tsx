import { Link, type LinkProps } from 'react-router';

import { button, type ButtonVariants } from './button.variants';
import { Ripple } from './Ripple';

export interface ButtonLinkProps extends Omit<LinkProps, 'className'>, ButtonVariants {
  className?: string;
}

export function ButtonLink({
  className,
  variant,
  size,
  icon,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={button({ variant, size, icon, className })} {...props}>
      <Ripple />
      {children}
    </Link>
  );
}
