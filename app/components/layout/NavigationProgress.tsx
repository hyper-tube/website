import { AnimatePresence, motion } from 'motion/react';
import { useNavigation } from 'react-router';
import type { Variants } from 'motion';

const CREEP = [0, 0.35, 0.62, 0.82, 0.95];
const CREEP_TIMES = [0, 0.02, 0.08, 0.3, 1];

const barVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: CREEP,
    opacity: 1,
    transition: {
      scaleX: { duration: 30, times: CREEP_TIMES, ease: 'easeOut' },
      opacity: { duration: 0.15, ease: 'easeOut' },
    },
  },
  done: {
    scaleX: 1,
    opacity: 0,
    transition: {
      scaleX: { duration: 0.2, ease: 'easeOut' },
      opacity: { duration: 0.25, delay: 0.15, ease: 'easeIn' },
    },
  },
} satisfies Variants;

export function NavigationProgress() {
  const { state } = useNavigation();

  return (
    <AnimatePresence>
      {state === 'loading' && (
        <motion.div
          key="progress"
          aria-hidden
          initial="hidden"
          animate="visible"
          exit="done"
          variants={barVariants}
          className="absolute inset-x-0 -bottom-px h-[3px] origin-left rounded-full bg-primary"
        />
      )}
    </AnimatePresence>
  );
}
