import ChevronRightIcon from '~icons/material-symbols/chevron-right-rounded';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import type { ReleaseSummary } from '~/lib/releases.shared';
import { ButtonLink } from '~/components/ui/ButtonLink';
import { formatDate } from '~/lib/format.shared';
import { Ripple } from '~/components/ui/Ripple';
import { cn } from '~/lib/styles.shared';

interface ReleaseHistoryRowProps {
  release: ReleaseSummary;
  latest: boolean;
}

const ROW = cn(
  'state-layer relative flex min-h-18 items-center gap-4 border-t border-outline-variant/60 px-5',
  'first:border-t-0 has-[a.row-link:focus-visible]:outline-2',
  'has-[a.row-link:focus-visible]:outline-primary',
);

export function ReleaseHistoryRow({ release, latest }: ReleaseHistoryRowProps) {
  const { t, i18n } = useTranslation('download');

  return (
    <li className={ROW}>
      <Ripple />

      <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-0.5 py-3">
        <Link
          to={`/download/${release.version}`}
          aria-label={t('history.downloads', { version: release.version })}
          className="row-link text-title-medium outline-none after:absolute after:inset-0"
        >
          {release.version}
        </Link>

        {latest && <span className="text-label-medium text-primary">{t('history.latest')}</span>}
        {release.prerelease && (
          <span className="text-label-medium text-tertiary">{t('history.prerelease')}</span>
        )}

        <span className="w-full text-body-small text-on-surface-variant sm:w-auto">
          {formatDate(release.publishedAt, i18n.language)}
        </span>
      </div>

      <ButtonLink
        to={`/changelog#v${release.version}`}
        variant="text"
        size="sm"
        className="relative z-10 max-sm:hidden"
      >
        {t('history.notes')}
      </ButtonLink>

      <ChevronRightIcon aria-hidden className="size-6 text-on-surface-variant" />
    </li>
  );
}
