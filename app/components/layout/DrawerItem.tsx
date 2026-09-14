import { NavLink } from 'react-router';

import { Ripple } from '~/components/ui/Ripple';
import { tv } from '~/lib/styles.shared';

interface DrawerItemProps {
  path: string;
  label: string;
  onNavigate: () => void;
}

const drawerItem = tv({
  base: [
    'state-layer flex h-14 items-center rounded-full px-4 text-label-large',
    'transition-colors duration-200 ease-effects',
  ],
  variants: {
    active: {
      true: 'bg-secondary-container text-on-secondary-container',
      false: 'text-on-surface-variant',
    },
  },
});

export function DrawerItem({ path, label, onNavigate }: DrawerItemProps) {
  return (
    <NavLink
      to={path}
      end={path === '/'}
      onClick={onNavigate}
      className={({ isActive }) => drawerItem({ active: isActive })}
    >
      <Ripple />
      {label}
    </NavLink>
  );
}
