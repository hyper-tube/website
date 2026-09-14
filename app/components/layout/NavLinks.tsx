import { useTranslation } from 'react-i18next';
import { LayoutGroup } from 'motion/react';

import { NAVIGATION_LINKS } from '~/lib/navigation.shared';
import { cn } from '~/lib/styles.shared';

import { NavItem } from './NavItem';

interface NavLinksProps {
  className?: string;
}

export function NavLinks({ className }: NavLinksProps) {
  const { t } = useTranslation();

  return (
    <nav aria-label={t('a11y.navigation')} className={cn('items-center gap-1', className)}>
      <LayoutGroup id="header-navigation">
        {NAVIGATION_LINKS.map((link) => (
          <NavItem key={link.path} link={link} />
        ))}
      </LayoutGroup>
    </nav>
  );
}
