import CheckIcon from '~icons/material-symbols/check-rounded';
import { AnimatePresence, motion } from 'motion/react';

import { TRANSITIONS } from '~/lib/motion.shared';
import { cn } from '~/lib/styles.shared';

interface ColorSwatchProps {
  color: string;
  label: string;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}

const SWATCH = cn(
  'grid size-10 place-items-center rounded-[20px] ring-offset-2 ring-offset-background',
  'transition-[scale,box-shadow,opacity,border-radius] duration-350 ease-expressive-fast',
  'active:scale-90 disabled:opacity-40',
);

const CHECK =
  'grid size-6 place-items-center rounded-full bg-surface-container-lowest text-on-surface';

export function ColorSwatch({ color, label, selected, disabled, onSelect }: ColorSwatchProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      disabled={disabled}
      onClick={onSelect}
      style={{ backgroundColor: color }}
      className={cn(SWATCH, selected && 'rounded-small ring-2 ring-on-surface')}
    >
      <AnimatePresence>
        {selected && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={TRANSITIONS.fastSpatial}
            className={CHECK}
          >
            <CheckIcon aria-hidden className="size-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
