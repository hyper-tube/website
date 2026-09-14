import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import { useMotionTransition } from '~/hooks/useMotionTransition';
import type { TourScreen } from '~/lib/tour.shared';
import { TRANSITIONS } from '~/lib/motion.shared';

interface TourCaptionProps {
  screen: TourScreen;
}

const SWAP = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export function TourCaption({ screen }: TourCaptionProps) {
  const { t } = useTranslation('landing');
  const transition = useMotionTransition(TRANSITIONS.enter);

  return (
    <div aria-live="polite" className="grid min-h-12 place-items-center text-center">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={screen}
          {...SWAP}
          transition={transition}
          className="max-w-xl text-body-large text-pretty text-on-surface-variant"
        >
          {t(`tour.screens.${screen}.caption`)}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
