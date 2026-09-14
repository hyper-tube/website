import type { MetaDescriptor } from 'react-router';

import { SITE_NAME, type SiteConfig } from './site.shared';

export const OG_IMAGE = { path: '/og.png', width: 1200, height: 630 } as const;

export interface PageMeta {
  readonly title?: string;
  readonly description?: string;

  readonly absolute?: boolean;
}

interface MetaMatch {
  readonly id: string;
  readonly loaderData?: unknown;
}

function siteFromMatches(matches: readonly (MetaMatch | undefined)[]): SiteConfig | undefined {
  const root = matches.find((match) => match?.id === 'root')?.loaderData;

  if (root && typeof root === 'object' && 'site' in root) {
    return root.site as SiteConfig;
  }

  return undefined;
}

export function pageMeta(
  meta: PageMeta | undefined,
  pathname: string,
  matches: readonly (MetaMatch | undefined)[],
): MetaDescriptor[] {
  const origin = siteFromMatches(matches)?.origin ?? '';

  const title = meta?.title
    ? meta.absolute
      ? meta.title
      : `${meta.title} - ${SITE_NAME}`
    : SITE_NAME;
  const description = meta?.description ?? '';
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/';
  const url = `${origin}${path}`;
  const image = `${origin}${OG_IMAGE.path}`;

  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: url },

    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: url },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: String(OG_IMAGE.width) },
    { property: 'og:image:height', content: String(OG_IMAGE.height) },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ];
}
