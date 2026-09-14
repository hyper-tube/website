import { animate, useMotionValue, type MotionValue } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';

interface TourCycle {
  index: number;
  progress: MotionValue<number>;
  select: (index: number) => void;
}

export function useTourCycle(length: number, interval: number, running: boolean): TourCycle {
  const [index, setIndex] = useState(0);
  const progress = useMotionValue(0);

  useEffect(() => {
    if (!running) return;

    const controls = animate(progress, 1, {
      duration: (interval / 1000) * (1 - progress.get()),
      ease: 'linear',
      onComplete: () => {
        progress.set(0);
        setIndex((current) => (current + 1) % length);
      },
    });

    return () => controls.stop();
  }, [running, index, interval, length, progress]);

  const select = useCallback(
    (next: number) => {
      progress.set(0);
      setIndex(next);
    },
    [progress],
  );

  return { index, progress, select };
}
