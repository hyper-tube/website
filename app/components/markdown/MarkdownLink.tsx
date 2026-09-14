import type { ComponentProps } from 'react';

import { INLINE_LINK } from '~/components/ui/link.styles';
import { cn } from '~/lib/styles.shared';

const COMMIT_SHA = /^[0-9a-f]{7,40}$/i;

const COMMIT = cn(
  'rounded-verysmall px-1.5 py-0.5 align-[0.08em] font-mono text-label-small',
  'text-on-surface-variant',
  'bg-surface-container-high transition-colors duration-200 ease-effects hover:text-on-surface',
);

export function MarkdownLink({ children, className, ...props }: ComponentProps<'a'>) {
  const isCommit = typeof children === 'string' && COMMIT_SHA.test(children);

  return (
    <a
      target="_blank"
      rel="noreferrer"
      className={cn(isCommit ? COMMIT : INLINE_LINK, className)}
      {...props}
    >
      {children}
    </a>
  );
}
