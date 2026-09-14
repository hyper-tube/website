import { latestRelease, listReleases, toNotes } from '~/lib/releases.server';
import { ChangelogTimeline } from '~/components/changelog/ChangelogTimeline';
import { ChangelogHeader } from '~/components/changelog/ChangelogHeader';
import { ChangelogEmpty } from '~/components/changelog/ChangelogEmpty';
import { getInstance } from '~/middlewares/i18n.server';
import { pageMeta } from '~/lib/meta.shared';

import type { Route } from './+types/changelog';

export async function loader({ context }: Route.LoaderArgs) {
  const i18n = getInstance(context);
  const { releases, available } = await listReleases();

  return {
    releases: releases.map(toNotes),
    latestVersion: latestRelease(releases)?.version ?? null,
    available,
    meta: {
      title: i18n.t('changelog:meta.title'),
      description: i18n.t('changelog:meta.description'),
    },
  };
}

export function meta({ loaderData, location, matches }: Route.MetaArgs) {
  return pageMeta(loaderData?.meta, location.pathname, matches);
}

export default function ChangelogRoute({ loaderData }: Route.ComponentProps) {
  const { releases, latestVersion, available } = loaderData;

  if (releases.length === 0) return <ChangelogEmpty available={available} />;

  return (
    <div className="container-page flex flex-col gap-16 py-12 md:py-16">
      <ChangelogHeader />
      <ChangelogTimeline releases={releases} latestVersion={latestVersion} />
    </div>
  );
}
