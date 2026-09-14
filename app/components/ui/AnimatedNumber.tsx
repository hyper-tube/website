import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { useEffect } from 'react';

import { TRANSITIONS } from '~/lib/motion.shared';

interface AnimatedNumberProps {
  value: number;
  from?: number;
  format: (value: number) => string;
  className?: string;
}

export function AnimatedNumber({ value, from = value, format, className }: AnimatedNumberProps) {
  const shouldReduceMotion = useReducedMotion();
  const current = useMotionValue(from);
  const text = useTransform(current, format);

  useEffect(() => {
    if (shouldReduceMotion) {
      current.set(value);
      return;
    }

    const controls = animate(current, value, TRANSITIONS.slowSpatial);

    return () => controls.stop();
  }, [value, current, shouldReduceMotion]);

  return <motion.span className={className}>{text}</motion.span>;
}
