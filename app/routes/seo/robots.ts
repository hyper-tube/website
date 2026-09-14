import { cacheHeader } from 'pretty-cache-header';

import { getSiteConfig } from '~/lib/site.server';

import type { Route } from './+types/robots';

export function loader({ request }: Route.LoaderArgs) {
  const { origin } = getSiteConfig(request);

  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /download/latest/',
    '',
    `Sitemap: ${origin}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': cacheHeader({ maxAge: '1h', sMaxage: '1d', staleWhileRevalidate: '7d' }),
    },
  });
}
