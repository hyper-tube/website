export const SITE_NAME = 'HyperTube Music';

export const DEFAULT_REPOSITORY = 'hyper-tube/app';

export interface SiteConfig {
  readonly origin: string;
  readonly repository: string;
}

export function githubUrl(repository: string, path = ''): string {
  const base = `https://github.com/${repository}`;

  return path ? `${base}/${path}` : base;
}
