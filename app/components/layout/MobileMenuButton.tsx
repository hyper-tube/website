import MenuIcon from '~icons/material-symbols/menu-rounded';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { useState } from 'react';

import { Button } from '~/components/ui/Button';

import { NavigationDrawer } from './NavigationDrawer';

interface MobileMenuButtonProps {
  className?: string;
}

export function MobileMenuButton({ className }: MobileMenuButtonProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  return (
    <>
      <Button
        variant="standard"
        icon
        aria-label={t('a11y.openMenu')}
        onClick={() => setOpen(true)}
        className={className}
      >
        <MenuIcon aria-hidden />
      </Button>

      <NavigationDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
