import LightModeIcon from '~icons/material-symbols/light-mode-outline-rounded';
import DarkModeIcon from '~icons/material-symbols/dark-mode-outline-rounded';
import { useTranslation } from 'react-i18next';
import type { MouseEvent } from 'react';

import { Button } from '~/components/ui/Button';
import { useTheme } from '~/providers/theme';
import { cn } from '~/lib/styles.shared';

const GLYPH = 'absolute transition-[rotate,scale,opacity] duration-500 ease-expressive';

export function ThemeToggle() {
  const { t } = useTranslation();
  const { toggleTheme } = useTheme();

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();

    toggleTheme({ x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 });
  };

  return (
    <Button variant="standard" icon aria-label={t('header.toggleTheme')} onClick={onClick}>
      <LightModeIcon
        aria-hidden
        className={cn(GLYPH, 'dark:scale-50 dark:-rotate-90 dark:opacity-0')}
      />
      <DarkModeIcon
        aria-hidden
        className={cn(
          GLYPH,
          'scale-50 rotate-90 opacity-0 dark:scale-100 dark:rotate-0 dark:opacity-100',
        )}
      />
    </Button>
  );
}
