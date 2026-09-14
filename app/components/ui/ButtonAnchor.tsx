import type { ComponentProps } from 'react';

import { button, type ButtonVariants } from './button.variants';
import { Ripple } from './Ripple';

export interface ButtonAnchorProps extends ComponentProps<'a'>, ButtonVariants {
  external?: boolean;
}

export function ButtonAnchor({
  className,
  variant,
  size,
  icon,
  external,
  children,
  ...props
}: ButtonAnchorProps) {
  return (
    <a
      className={button({ variant, size, icon, className })}
      {...(external && { target: '_blank', rel: 'noreferrer' })}
      {...props}
    >
      <Ripple />
      {children}
    </a>
  );
}
