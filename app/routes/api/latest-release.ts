import { cacheHeader } from 'pretty-cache-header';
import { data } from 'react-router';

import {
  entityTag,
  matchesEntityTag,
  releaseForChannel,
  toUpdateInfo,
  updateQuerySchema,
} from '~/lib/updates.server';
import { listReleases } from '~/lib/releases.server';
import { getSiteConfig } from '~/lib/site.server';

import type { Route } from './+types/latest-release';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Expose-Headers': 'ETag',
};

const CACHED = cacheHeader({
  public: true,
  maxAge: '5m',
  sMaxage: '10m',
  staleWhileRevalidate: '1h',
});

const failure = (status: number, code: string, message: string, headers: HeadersInit = {}) =>
  data(
    { error: { code, message } },
    { status, headers: { ...CORS, 'Cache-Control': 'no-store', ...headers } },
  );

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = updateQuerySchema.safeParse(Object.fromEntries(url.searchParams));

  if (!query.success) {
    return failure(400, 'invalid_query', 'channel must be "stable" or "prerelease"');
  }

  const { releases, available } = await listReleases();

  if (!available) {
    return failure(503, 'unavailable', 'Releases cannot be loaded right now', {
      'Retry-After': '60',
    });
  }

  const release = releaseForChannel(releases, query.data.channel);

  if (!release) {
    return failure(404, 'not_found', `No ${query.data.channel} release has been published`);
  }

  const body = toUpdateInfo(release, query.data.channel, getSiteConfig(request));
  const headers = { ...CORS, 'Cache-Control': CACHED, ETag: entityTag(body) };

  if (matchesEntityTag(request.headers.get('If-None-Match'), headers.ETag)) {
    return new Response(null, { status: 304, headers });
  }

  return data(body, { headers });
}
