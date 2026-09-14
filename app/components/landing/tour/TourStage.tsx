import { AnimatePresence, motion } from 'motion/react';

import { SCREENSHOT_SIZE, type TourScreen } from '~/lib/tour.shared';
import { useMotionTransition } from '~/hooks/useMotionTransition';
import { TRANSITIONS } from '~/lib/motion.shared';
import { cn } from '~/lib/styles.shared';

import { TourScreenshot } from './TourScreenshot';

interface TourStageProps {
  screen: TourScreen;
  panelId: string;
  labelledBy: string;
  onHoverChange: (hovered: boolean) => void;
}

const EXIT = {
  opacity: 1,
  zIndex: 1,
  transition: { duration: 0, delay: TRANSITIONS.slowSpatial.duration },
};

const OUTLINE = cn(
  'pointer-events-none absolute inset-0 z-10 rounded-[1.004%/1.607%]',
  'ring-1 ring-outline-variant/70 dark:ring-outline-variant',
);

const SHADOW = cn(
  'absolute inset-[1%] -z-10 rounded-[2%] shadow-[0_40px_90px_-30px_rgb(0_0_0/0.45)]',
  'dark:shadow-[0_40px_90px_-30px_rgb(0_0_0/0.9)]',
);

export function TourStage({ screen, panelId, labelledBy, onHoverChange }: TourStageProps) {
  const reveal = useMotionTransition({
    ...TRANSITIONS.emphasized,
    duration: TRANSITIONS.slowSpatial.duration,
  });

  return (
    <div className="tour-tilt-timeline perspective-[2400px]">
      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={labelledBy}
        style={{ aspectRatio: `${SCREENSHOT_SIZE.width} / ${SCREENSHOT_SIZE.height}` }}
        onPointerEnter={() => onHoverChange(true)}
        onPointerLeave={() => onHoverChange(false)}
        className="tour-tilt relative isolate origin-bottom"
      >
        <div aria-hidden className={SHADOW} />

        <AnimatePresence initial={false}>
          <motion.div
            key={screen}
            initial={{ clipPath: 'inset(18% 18% 18% 18% round 64px)', opacity: 0, zIndex: 2 }}
            animate={{ clipPath: 'inset(0% 0% 0% 0% round 0px)', opacity: 1, zIndex: 2 }}
            exit={EXIT}
            transition={{ ...reveal, opacity: TRANSITIONS.effects, zIndex: { duration: 0 } }}
            className="absolute inset-0"
          >
            <TourScreenshot screen={screen} eager={screen === 'home'} />
          </motion.div>
        </AnimatePresence>

        <div aria-hidden className={OUTLINE} />
      </div>
    </div>
  );
}
