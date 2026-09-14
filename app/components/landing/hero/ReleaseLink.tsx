import ArrowForwardIcon from '~icons/material-symbols/arrow-forward-rounded';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Ripple } from '~/components/ui/Ripple';
import { cn } from '~/lib/styles.shared';

interface ReleaseLinkProps {
  version: string;
}

const LINK = cn(
  'group state-layer inline-flex h-9 items-center gap-2 rounded-full bg-surface-container',
  'pr-3 pl-4 text-label-large text-on-surface-variant',
);

const ARROW = cn(
  'size-4 text-primary transition-transform duration-350 ease-expressive-fast',
  'group-hover:translate-x-0.5',
);

export function ReleaseLink({ version }: ReleaseLinkProps) {
  const { t } = useTranslation('landing');

  return (
    <Link to={`/changelog#v${version}`} className={LINK}>
      <Ripple />
      <span className="text-on-surface">{t('hero.release', { version })}</span>
      <span aria-hidden className="h-4 w-px bg-outline-variant" />
      {t('hero.releaseLink')}
      <ArrowForwardIcon aria-hidden className={ARROW} />
    </Link>
  );
}
