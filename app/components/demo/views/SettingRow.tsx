import type { ReactNode } from 'react';

interface SettingRowProps {
  title: string;
  hint?: string;
  children: ReactNode;
}

export function SettingRow({ title, hint, children }: SettingRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <div className="flex flex-col">
        <span className="text-title-medium text-on-surface">{title}</span>
        {hint && <span className="text-body-small text-on-surface-variant">{hint}</span>}
      </div>

      {children}
    </div>
  );
}
