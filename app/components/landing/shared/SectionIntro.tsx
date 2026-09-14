import type { ReactNode } from 'react';

import { cn } from '~/lib/styles.shared';

interface SectionIntroProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  className?: string;
}

export function SectionIntro({ eyebrow, title, description, className }: SectionIntroProps) {
  return (
    <header className={cn('flex max-w-2xl flex-col gap-4', className)}>
      {eyebrow && <p className="text-label-large text-primary">{eyebrow}</p>}
      <h2 className="text-display-medium text-balance">{title}</h2>
      {description && (
        <p className="text-body-large text-pretty text-on-surface-variant">{description}</p>
      )}
    </header>
  );
}
