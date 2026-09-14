import HistoryIcon from '~icons/material-symbols/history-rounded';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { cn } from '~/lib/styles.shared';

const NOTICE = cn(
  'flex items-start gap-3 rounded-normal p-4',
  'bg-tertiary-container text-on-tertiary-container',
);

interface OlderVersionNoticeProps {
  latestVersion: string;
}

export function OlderVersionNotice({ latestVersion }: OlderVersionNoticeProps) {
  const { t } = useTranslation('download');

  return (
    <div className={NOTICE}>
      <HistoryIcon aria-hidden className="mt-0.5 size-5 shrink-0" />

      <p className="text-body-medium">
        {t('header.olderVersion')}{' '}
        <Link to="/download" className="font-semibold underline underline-offset-4">
          {t('header.latestLink', { version: latestVersion })}
        </Link>
      </p>
    </div>
  );
}
