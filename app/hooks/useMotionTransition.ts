import { useReducedMotion, type Transition } from 'motion/react';

import { REDUCED_TRANSITION } from '~/lib/motion.shared';

export function useMotionTransition<T extends Transition>(transition: T): T | Transition {
  return useReducedMotion() ? REDUCED_TRANSITION : transition;
}
