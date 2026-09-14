import { redirect } from 'react-router';
import { z } from 'zod';

import { latestRelease, listReleases } from '~/lib/releases.server';
import { PACKAGE_FORMATS } from '~/lib/platforms.shared';
import { parseParams } from '~/lib/params.shared';

import type { Route } from './+types/latest';

const paramsSchema = z.object({ format: z.enum(PACKAGE_FORMATS) });

export async function loader({ params }: Route.LoaderArgs) {
  const { format } = parseParams(paramsSchema, params);
  const { releases } = await listReleases();

  const asset = latestRelease(releases)?.assets.find((candidate) => candidate.format === format);

  if (!asset) throw new Response('Not Found', { status: 404 });

  return redirect(asset.url, { status: 302, headers: { 'Cache-Control': 'no-store' } });
}
