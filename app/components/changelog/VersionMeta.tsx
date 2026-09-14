import { useTranslation } from 'react-i18next';

import type { ReleaseSummary } from '~/lib/releases.shared';
import { cn } from '~/lib/styles.shared';

const LABEL = 'rounded-full px-3 py-1 text-label-medium';

const DATE = 'text-body-medium text-on-surface-variant lg:hidden';

interface VersionMetaProps {
  release: ReleaseSummary;
  latest: boolean;
  date: string;
}

export function VersionMeta({ release, latest, date }: VersionMetaProps) {
  const { t } = useTranslation('changelog');

  if (!latest && !release.prerelease) {
    return (
      <time dateTime={release.publishedAt} className={cn(DATE, 'mb-2')}>
        {date}
      </time>
    );
  }

  return (
    <div className="mb-3 flex items-center gap-3">
      {latest && (
        <span className={cn(LABEL, 'bg-primary text-on-primary')}>{t('version.latest')}</span>
      )}

      {release.prerelease && (
        <span className={cn(LABEL, 'bg-tertiary-container text-on-tertiary-container')}>
          {t('version.prerelease')}
        </span>
      )}

      <time dateTime={release.publishedAt} className={DATE}>
        {date}
      </time>
    </div>
  );
}
