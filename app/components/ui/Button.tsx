import type { ComponentProps } from 'react';

import { button, type ButtonVariants } from './button.variants';
import { Ripple } from './Ripple';

export interface ButtonProps extends ComponentProps<'button'>, ButtonVariants {}

export function Button({ className, variant, size, icon, children, ...props }: ButtonProps) {
  return (
    <button type="button" className={button({ variant, size, icon, className })} {...props}>
      <Ripple />
      {children}
    </button>
  );
}
