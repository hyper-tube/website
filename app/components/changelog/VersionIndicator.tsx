import { motion } from 'motion/react';

import { useMotionTransition } from '~/hooks/useMotionTransition';
import { TRANSITIONS } from '~/lib/motion.shared';
import { cn } from '~/lib/styles.shared';

interface VersionIndicatorProps {
  date: string;
  label: string;
  reached: boolean;
}

const INDICATOR = cn(
  'absolute top-0 left-0 hidden h-10 w-32 min-w-0',
  'items-center justify-end gap-3 lg:flex',
);

const DOT = cn(
  'flex size-4 shrink-0 items-center justify-center rounded-full',
  'bg-background ring ring-outline-variant',
);

export function VersionIndicator({ date, label, reached }: VersionIndicatorProps) {
  const transition = useMotionTransition(TRANSITIONS.fastSpatial);

  return (
    <div className={INDICATOR}>
      <time dateTime={date} className="truncate text-body-medium text-on-surface-variant">
        {label}
      </time>

      <div className={DOT}>
        <motion.div
          initial={false}
          animate={{ scale: reached ? 1 : 0.5, opacity: reached ? 1 : 0.6 }}
          transition={transition}
          className="size-2 rounded-full bg-primary"
        />
      </div>
    </div>
  );
}
