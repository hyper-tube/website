import { useTranslation } from 'react-i18next';
import { useInView } from 'motion/react';
import { useRef } from 'react';

import type { ReleaseNotes } from '~/lib/releases.shared';
import { Markdown } from '~/components/markdown/Markdown';
import { formatDate } from '~/lib/format.shared';

import { VersionIndicator } from './VersionIndicator';
import { VersionActions } from './VersionActions';
import { VersionMeta } from './VersionMeta';

interface ChangelogVersionProps {
  release: ReleaseNotes;
  latest: boolean;
}

const REACHED_MARGIN = '0px 0px -50% 0px';

export function ChangelogVersion({ release, latest }: ChangelogVersionProps) {
  const { t, i18n } = useTranslation('changelog');
  const ref = useRef<HTMLElement>(null);

  const reached = useInView(ref, { margin: REACHED_MARGIN });
  const date = formatDate(release.publishedAt, i18n.language);

  return (
    <article ref={ref} id={`v${release.version}`} className="relative scroll-mt-28">
      <VersionIndicator date={release.publishedAt} label={date} reached={reached} />

      <div className="mx-auto flex max-w-2xl flex-col">
        <VersionMeta release={release} latest={latest} date={date} />

        <h2 className="text-headline-large">
          <a href={`#v${release.version}`} className="hover:text-primary">
            {release.name}
          </a>
        </h2>

        <div className="mt-6">
          {release.notes ? (
            <Markdown tree={release.notes} />
          ) : (
            <p className="text-body-large text-on-surface-variant">{t('version.noNotes')}</p>
          )}
        </div>

        <VersionActions release={release} />
      </div>
    </article>
  );
}
