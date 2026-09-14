import { useRouteLoaderData } from 'react-router';

import { DEFAULT_REPOSITORY, type SiteConfig } from '~/lib/site.shared';
import type { loader } from '~/root';

const FALLBACK: SiteConfig = { origin: '', repository: DEFAULT_REPOSITORY };

export function useSite(): SiteConfig {
  return useRouteLoaderData<typeof loader>('root')?.site ?? FALLBACK;
}
