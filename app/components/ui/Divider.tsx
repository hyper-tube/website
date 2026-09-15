import type { VariantProps } from 'tailwind-variants';
import type { ComponentProps } from 'react';

import { tv } from '~/lib/styles.shared';

const divider = tv({
  base: 'w-full shrink-0 border-0 bg-outline-variant',
  variants: {
    variant: {
      straight: 'h-px',
      wavy: 'wavy-line h-2',
    },
  },
  defaultVariants: {
    variant: 'straight',
  },
});

interface DividerProps extends ComponentProps<'hr'>, VariantProps<typeof divider> {}

export function Divider({ variant, className, ...props }: DividerProps) {
  return <hr className={divider({ variant, className })} {...props} />;
}
