import { useMotionValueEvent, type MotionValue } from 'motion/react';
import { useState } from 'react';

export function useWholeSeconds(value: MotionValue<number>): number {
  const [seconds, setSeconds] = useState(() => Math.floor(value.get()));

  useMotionValueEvent(value, 'change', (latest) => {
    const next = Math.floor(latest);
    if (next !== seconds) setSeconds(next);
  });

  return seconds;
}
