import ArrowOutwardIcon from '~icons/material-symbols/arrow-outward-rounded';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import type { FooterLink as FooterLinkData } from '~/lib/navigation.shared';
import { cn } from '~/lib/styles.shared';

interface FooterLinkProps {
  link: FooterLinkData;
}

const LINK = cn(
  'group inline-flex items-center gap-1 text-body-medium text-on-surface-variant',
  'transition-colors duration-200 ease-effects hover:text-on-surface',
);

const ARROW = cn(
  'size-4 -translate-x-1 opacity-0 transition-[translate,opacity] duration-350',
  'ease-expressive-fast group-hover:translate-x-0 group-hover:opacity-100',
);

export function FooterLink({ link }: FooterLinkProps) {
  const { t } = useTranslation();

  if ('href' in link) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer" className={LINK}>
        {t(link.labelKey)}
        <ArrowOutwardIcon aria-hidden className={ARROW} />
      </a>
    );
  }

  return (
    <Link to={link.to} className={LINK}>
      {t(link.labelKey)}
    </Link>
  );
}
