import { redirect } from 'react-router';
import { z } from 'zod';

import {
  latestRelease,
  listReleases,
  toDownloads,
  toSummary,
  versionParam,
} from '~/lib/releases.server';
import { DownloadPage } from '~/components/download/DownloadPage';
import { detectRequestPlatform } from '~/lib/platforms.server';
import { getInstance } from '~/middlewares/i18n.server';
import { parseParams } from '~/lib/params.shared';
import { pageMeta } from '~/lib/meta.shared';

import type { Route } from './+types/$version';

const paramsSchema = z.object({ version: versionParam });

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const { version } = parseParams(paramsSchema, params);

  if (params.version !== version) throw redirect(`/download/${version}`, 301);

  const i18n = getInstance(context);
  const { releases, available } = await listReleases();

  const release = releases.find((candidate) => candidate.version === version);

  if (!release && available) throw new Response('Not Found', { status: 404 });

  return {
    release: release ? toDownloads(release) : null,
    history: releases.map(toSummary),
    latestVersion: latestRelease(releases)?.version ?? null,
    platform: detectRequestPlatform(request),
    available,
    meta: {
      title: i18n.t('download:meta.versionTitle', { version }),
      description: i18n.t('download:meta.versionDescription', { version }),
    },
  };
}

export function meta({ loaderData, location, matches }: Route.MetaArgs) {
  return pageMeta(loaderData?.meta, location.pathname, matches);
}

export default function DownloadVersionRoute({ loaderData }: Route.ComponentProps) {
  return <DownloadPage {...loaderData} />;
}
