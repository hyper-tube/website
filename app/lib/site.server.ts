import { env } from './env.server';
import type { SiteConfig } from './site.shared';

export function getSiteConfig(request: Request): SiteConfig {
  const origin = env.SITE_URL ?? new URL(request.url).origin;

  return {
    origin: origin.replace(/\/+$/, ''),
    repository: env.GITHUB_REPOSITORY,
  };
}
