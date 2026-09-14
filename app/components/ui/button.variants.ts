import type { VariantProps } from 'tailwind-variants';

import { tv } from '~/lib/styles.shared';

export const button = tv({
  base: [
    'state-layer inline-flex shrink-0 items-center justify-center whitespace-nowrap select-none',
    'transition-[border-radius,scale,background-color,color,opacity] duration-350',
    'ease-expressive-fast active:scale-[0.97]',
    'disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none',
  ],
  variants: {
    variant: {
      filled: 'bg-primary text-on-primary',
      tonal: 'bg-secondary-container text-on-secondary-container',
      outlined: 'border border-outline-variant text-on-surface-variant',
      text: 'text-primary',
      elevated: 'bg-surface-container-low text-primary shadow-level1',
      standard: 'text-on-surface-variant',
    },
    size: {
      sm: [
        'h-9 gap-1.5 rounded-[18px] px-4 text-label-large',
        'active:rounded-small [&_svg]:size-[18px]',
      ],
      md: 'h-10 gap-2 rounded-[20px] px-5 text-label-large active:rounded-small [&_svg]:size-5',
      lg: 'h-14 gap-2.5 rounded-[28px] px-7 text-title-medium active:rounded-normal [&_svg]:size-6',
    },
    icon: {
      true: 'px-0',
    },
  },
  compoundVariants: [
    { icon: true, size: 'sm', class: 'w-9' },
    { icon: true, size: 'md', class: 'w-10' },
    { icon: true, size: 'lg', class: 'w-14' },
  ],
  defaultVariants: {
    variant: 'filled',
    size: 'md',
  },
});

export type ButtonVariants = VariantProps<typeof button>;
