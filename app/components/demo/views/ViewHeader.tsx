import type { ReactNode } from 'react';

interface ViewHeaderProps {
  title: string;
  action?: ReactNode;
}

export function ViewHeader({ title, action }: ViewHeaderProps) {
  return (
    <div className="flex min-h-10 flex-wrap items-center justify-between gap-3">
      <h3 className="text-headline-small text-on-surface">{title}</h3>
      {action}
    </div>
  );
}
