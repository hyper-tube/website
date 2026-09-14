import { cn } from '~/lib/styles.shared';

export const INLINE_LINK = cn(
  'font-medium text-primary underline decoration-primary/40 underline-offset-4',
  'transition-[text-decoration-color] duration-200 ease-effects hover:decoration-primary',
);

export const INLINE_CODE = cn(
  'rounded-verysmall bg-surface-container-high px-1.5 py-0.5',
  'font-mono text-[0.9em] wrap-anywhere text-on-surface',
);
