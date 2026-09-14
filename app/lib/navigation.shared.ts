import type { ParseKeys } from 'i18next';

import { githubUrl } from './site.shared';

type CommonKey = ParseKeys<'common'>;

export interface NavigationLink {
  readonly path: string;
  readonly labelKey: CommonKey;
}

export type FooterLink =
  | { readonly labelKey: CommonKey; readonly to: string }
  | { readonly labelKey: CommonKey; readonly href: string };

export interface FooterColumnData {
  readonly titleKey: CommonKey;
  readonly links: readonly FooterLink[];
}

export const NAVIGATION_LINKS: readonly NavigationLink[] = [
  { path: '/download', labelKey: 'nav.download' },
  { path: '/changelog', labelKey: 'nav.changelog' },
  { path: '/faq', labelKey: 'nav.faq' },
];

export function isActiveLink(link: NavigationLink, pathname: string): boolean {
  return pathname === link.path || pathname.startsWith(`${link.path}/`);
}

export function footerColumns(repository: string): readonly FooterColumnData[] {
  return [
    {
      titleKey: 'footer.product',
      links: [
        { labelKey: 'nav.download', to: '/download' },
        { labelKey: 'nav.changelog', to: '/changelog' },
        { labelKey: 'nav.faq', to: '/faq' },
      ],
    },
    {
      titleKey: 'footer.project',
      links: [
        { labelKey: 'footer.links.source', href: githubUrl(repository) },
        { labelKey: 'footer.links.issues', href: githubUrl(repository, 'issues/new/choose') },
        { labelKey: 'footer.links.releases', href: githubUrl(repository, 'releases') },
      ],
    },
    {
      titleKey: 'footer.legal',
      links: [
        { labelKey: 'nav.terms', to: '/terms' },
        { labelKey: 'nav.privacy', to: '/privacy' },
        { labelKey: 'footer.links.license', href: githubUrl(repository, 'blob/HEAD/LICENSE') },
      ],
    },
  ];
}
