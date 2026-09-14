import { DownloadPage } from '~/components/download/DownloadPage';
import { latestRelease, listReleases, toDownloads, toSummary } from '~/lib/releases.server';
import { detectRequestPlatform } from '~/lib/platforms.server';
import { getInstance } from '~/middlewares/i18n.server';
import { pageMeta } from '~/lib/meta.shared';

import type { Route } from './+types/index';

export async function loader({ request, context }: Route.LoaderArgs) {
  const i18n = getInstance(context);
  const { releases, available } = await listReleases();

  const release = latestRelease(releases);

  return {
    release: release && toDownloads(release),
    history: releases.map(toSummary),
    latestVersion: release?.version ?? null,
    platform: detectRequestPlatform(request),
    available,
    meta: {
      title: i18n.t('download:meta.title'),
      description: i18n.t('download:meta.description'),
    },
  };
}

export function meta({ loaderData, location, matches }: Route.MetaArgs) {
  return pageMeta(loaderData?.meta, location.pathname, matches);
}

export default function DownloadRoute({ loaderData }: Route.ComponentProps) {
  return <DownloadPage {...loaderData} />;
}
