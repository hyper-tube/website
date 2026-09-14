import { useLocation, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

import { isActiveLink, type NavigationLink } from '~/lib/navigation.shared';
import { TRANSITIONS } from '~/lib/motion.shared';
import { Ripple } from '~/components/ui/Ripple';
import { tv } from '~/lib/styles.shared';

interface NavItemProps {
  link: NavigationLink;
  onNavigate?: () => void;
}

const navItem = tv({
  base: [
    'state-layer flex h-10 items-center rounded-full px-4 text-label-large',
    'transition-colors duration-200 ease-effects',
  ],
  variants: {
    active: {
      true: 'text-on-secondary-container',
      false: 'text-on-surface-variant hover:text-on-surface',
    },
  },
});

export function NavItem({ link, onNavigate }: NavItemProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const active = isActiveLink(link, pathname);

  return (
    <Link
      to={link.path}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={navItem({ active })}
    >
      {active && (
        <motion.span
          layoutId="nav-indicator"
          transition={TRANSITIONS.spatial}
          className="absolute inset-0 -z-10 rounded-full bg-secondary-container"
        />
      )}

      <Ripple />
      {t(link.labelKey)}
    </Link>
  );
}
