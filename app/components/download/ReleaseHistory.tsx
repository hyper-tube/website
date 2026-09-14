import { useTranslation } from 'react-i18next';

import type { ReleaseSummary } from '~/lib/releases.shared';

import { ReleaseHistoryRow } from './ReleaseHistoryRow';

interface ReleaseHistoryProps {
  releases: readonly ReleaseSummary[];
  current: string;
  latestVersion: string | null;
}

export function ReleaseHistory({ releases, current, latestVersion }: ReleaseHistoryProps) {
  const { t } = useTranslation('download');

  const others = releases.filter((release) => release.version !== current);
  if (others.length === 0) return null;

  return (
    <section className="grid gap-8 lg:grid-cols-[20rem_1fr] lg:gap-16">
      <header className="flex flex-col gap-3">
        <h2 className="text-headline-large">
          {current === latestVersion ? t('history.title') : t('history.otherTitle')}
        </h2>
        <p className="text-body-large text-on-surface-variant">{t('history.description')}</p>
      </header>

      <ul className="flex flex-col overflow-hidden rounded-large bg-surface-container-low">
        {others.map((release) => (
          <ReleaseHistoryRow
            key={release.version}
            release={release}
            latest={release.version === latestVersion}
          />
        ))}
      </ul>
    </section>
  );
}
