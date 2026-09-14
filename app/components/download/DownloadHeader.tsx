import OpenInNewIcon from '~icons/material-symbols/open-in-new-rounded';
import { useTranslation } from 'react-i18next';

import type { ReleaseSummary } from '~/lib/releases.shared';
import { ButtonAnchor } from '~/components/ui/ButtonAnchor';
import { ButtonLink } from '~/components/ui/ButtonLink';
import { formatDate } from '~/lib/format.shared';

import { OlderVersionNotice } from './OlderVersionNotice';

interface DownloadHeaderProps {
  release: ReleaseSummary;
  latestVersion: string | null;
}

export function DownloadHeader({ release, latestVersion }: DownloadHeaderProps) {
  const { t, i18n } = useTranslation('download');

  const isLatest = release.version === latestVersion;
  const date = formatDate(release.publishedAt, i18n.language);

  return (
    <header className="flex max-w-3xl flex-col gap-5">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-label-large text-primary">
        {t('header.released', { version: release.version, date })}
        {release.prerelease && <span className="text-tertiary">{t('header.prerelease')}</span>}
      </p>

      <h1 className="text-display-large text-balance">
        {isLatest ? t('header.title') : t('header.versionTitle', { version: release.version })}
      </h1>

      <p className="text-body-large text-pretty text-on-surface-variant">{t('header.subtitle')}</p>

      {!isLatest && latestVersion && <OlderVersionNotice latestVersion={latestVersion} />}

      <div className="flex flex-wrap gap-2 pt-1">
        <ButtonLink to={`/changelog#v${release.version}`} variant="tonal">
          {t('header.whatsNew')}
        </ButtonLink>

        <ButtonAnchor href={release.url} external variant="text">
          {t('header.viewOnGitHub')}
          <OpenInNewIcon aria-hidden />
        </ButtonAnchor>
      </div>
    </header>
  );
}
