import { cacheHeader } from 'pretty-cache-header';

import { buildSitemap } from '~/lib/sitemap.server';
import { getSiteConfig } from '~/lib/site.server';

import type { Route } from './+types/sitemap';

export async function loader({ request }: Route.LoaderArgs) {
  const body = await buildSitemap(getSiteConfig(request).origin);

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': cacheHeader({ maxAge: '1h', sMaxage: '1d', staleWhileRevalidate: '7d' }),
    },
  });
}
