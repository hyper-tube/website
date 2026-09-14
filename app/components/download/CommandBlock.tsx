import { useTranslation } from 'react-i18next';

import { CopyButton } from '~/components/ui/CopyButton';
import { cn } from '~/lib/styles.shared';

const BLOCK = cn(
  'flex items-center gap-2 rounded-small bg-surface-container-high',
  'py-1.5 pr-1.5 pl-4',
);

const CODE = cn(
  'min-w-0 flex-1 overflow-x-auto py-1',
  'font-mono text-body-medium whitespace-nowrap',
);

interface CommandBlockProps {
  command: string;
}

export function CommandBlock({ command }: CommandBlockProps) {
  const { t } = useTranslation('download');

  return (
    <div className={BLOCK}>
      <code className={CODE}>
        <span aria-hidden className="mr-2 text-on-surface-variant select-none">
          $
        </span>
        {command}
      </code>

      <CopyButton value={command} label={t('install.copyCommand')} />
    </div>
  );
}
