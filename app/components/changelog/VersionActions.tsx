import DownloadIcon from '~icons/material-symbols/download-rounded';
import OpenInNewIcon from '~icons/material-symbols/open-in-new-rounded';
import { useTranslation } from 'react-i18next';

import { formatCompact } from '~/lib/format.shared';
import type { ReleaseSummary } from '~/lib/releases.shared';
import { ButtonAnchor } from '~/components/ui/ButtonAnchor';
import { ButtonLink } from '~/components/ui/ButtonLink';

interface VersionActionsProps {
  release: ReleaseSummary;
}

export function VersionActions({ release }: VersionActionsProps) {
  const { t, i18n } = useTranslation('changelog');

  const downloads = t('version.downloads', {
    count: release.downloads,
    formatted: formatCompact(release.downloads, i18n.language),
  });

  return (
    <footer className="mt-8 flex flex-wrap items-center gap-2 border-t border-outline-variant pt-5">
      <ButtonLink to={`/download/${release.version}`} variant="tonal" size="sm">
        <DownloadIcon aria-hidden />
        {t('version.download', { version: release.version })}
      </ButtonLink>

      <ButtonAnchor href={release.url} external variant="text" size="sm">
        {t('version.github')}
        <OpenInNewIcon aria-hidden />
      </ButtonAnchor>

      <span className="ml-auto text-body-small text-on-surface-variant">{downloads}</span>
    </footer>
  );
}
