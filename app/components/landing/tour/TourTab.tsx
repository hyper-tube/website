import { motion, type MotionValue } from 'motion/react';

import { TRANSITIONS } from '~/lib/motion.shared';
import { Ripple } from '~/components/ui/Ripple';
import { tv } from '~/lib/styles.shared';

interface TourTabProps {
  id: string;
  panelId: string;
  label: string;
  selected: boolean;
  progress: MotionValue<number>;
  onSelect: () => void;
}

const tab = tv({
  base: [
    'state-layer flex h-10 shrink-0 items-center rounded-full px-4 text-label-large',
    'transition-colors duration-200 ease-effects',
  ],
  variants: {
    selected: {
      true: 'text-on-secondary-container',
      false: 'text-on-surface-variant hover:text-on-surface',
    },
  },
});

export function TourTab({ id, panelId, label, selected, progress, onSelect }: TourTabProps) {
  return (
    <button
      id={id}
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      className={tab({ selected })}
    >
      {selected && (
        <motion.span
          layoutId="tour-indicator"
          transition={TRANSITIONS.spatial}
          className="absolute inset-0 -z-10 overflow-hidden rounded-full bg-secondary-container"
        >
          <motion.span
            style={{ scaleX: progress }}
            className="absolute inset-0 origin-left bg-on-secondary-container/10"
          />
        </motion.span>
      )}

      <Ripple />
      {label}
    </button>
  );
}
