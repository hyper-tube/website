import CheckIcon from '~icons/material-symbols/check-rounded';
import type { ReactNode } from 'react';

import { tv } from '~/lib/styles.shared';

import { Ripple } from './Ripple';

interface MenuItemProps {
  checked?: boolean;
  onSelect: () => void;
  children: ReactNode;
  lang?: string;
}

const menuItem = tv({
  base: [
    'state-layer flex h-11 w-full items-center gap-3 rounded-small px-3 text-left text-body-large',
    'transition-colors duration-200 ease-effects outline-none focus-visible:outline-none',
  ],
  variants: {
    checked: {
      true: 'bg-secondary-container text-on-secondary-container',
      false: 'text-on-surface',
    },
  },
});

export function MenuItem({ checked = false, onSelect, children, lang }: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={checked}
      lang={lang}
      onClick={onSelect}
      className={menuItem({ checked })}
    >
      <Ripple />

      <span className="flex-1">{children}</span>

      {checked && <CheckIcon aria-hidden className="size-5" />}
    </button>
  );
}
