import { useMotionValueEvent, type MotionValue } from 'motion/react';
import { useState } from 'react';

import { lyricIndexAt, type LyricLine } from '~/lib/playground.shared';

const LEAD = 0.15;

export function useLyricIndex(lines: readonly LyricLine[], position: MotionValue<number>): number {
  const [index, setIndex] = useState(() => lyricIndexAt(lines, position.get() + LEAD));

  useMotionValueEvent(position, 'change', (latest) => {
    const next = lyricIndexAt(lines, latest + LEAD);
    if (next !== index) setIndex(next);
  });

  return index;
}
