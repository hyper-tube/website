import { motion, useTransform } from 'motion/react';
import { useTranslation } from 'react-i18next';

import {
  barsInWindow,
  transitionLevels,
  transitionWindow,
  type TransitionPair,
} from '~/lib/transitions.shared';
import { useMotionTransition } from '~/hooks/useMotionTransition';
import { useDemoPlayer } from '~/providers/demo-player';
import { TRANSITIONS } from '~/lib/motion.shared';
import { areaPath } from '~/lib/shapes.shared';

import { ChartLabel } from './ChartLabel';

interface TransitionChartProps {
  pair: TransitionPair;
}

const WIDTH = 600;
const HEIGHT = 150;
const SAMPLES = 64;
const BAR_SLOTS = 16;

export function TransitionChart({ pair }: TransitionChartProps) {
  const { t } = useTranslation('landing');
  const { timeline } = useDemoPlayer();
  const transition = useMotionTransition(TRANSITIONS.slowSpatial);

  const { plan, from, to } = pair;
  const window = transitionWindow(plan);
  const levels = transitionLevels(plan, from, to, SAMPLES);
  const bars = barsInWindow(plan, BAR_SLOTS);

  const toX = (time: number) => ((time - window.start) / (window.end - window.start)) * WIDTH;

  const playhead = useTransform(timeline, (time) =>
    Number.isFinite(time) ? Math.min(Math.max(toX(time), 0), WIDTH) : 0,
  );
  const playheadOpacity = useTransform(timeline, (time) =>
    time >= window.start && time <= window.end ? 1 : 0,
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between gap-4">
        <ChartLabel label={t('playground.transitions.outgoing')} title={from.title} />
        <ChartLabel
          label={t('playground.transitions.incoming')}
          title={to.title}
          tone="tertiary"
          align="end"
        />
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden
        className="h-36 w-full overflow-visible"
      >
        <motion.rect
          y={0}
          height={HEIGHT}
          initial={false}
          animate={{
            x: toX(plan.outStart),
            width: Math.max((plan.length / (window.end - window.start)) * WIDTH, 2),
          }}
          transition={transition}
          className="fill-on-surface/5"
        />

        {Array.from({ length: BAR_SLOTS }, (_, index) => {
          const x = bars[index] === undefined ? WIDTH : toX(bars[index]);

          return (
            <motion.line
              key={index}
              y1={HEIGHT + 6}
              y2={HEIGHT + 12}
              initial={false}
              animate={{ x1: x, x2: x, opacity: bars[index] === undefined ? 0 : 1 }}
              transition={transition}
              className="stroke-outline stroke-2"
            />
          );
        })}

        <motion.path
          initial={false}
          animate={{ d: areaPath(levels.out, WIDTH, HEIGHT) }}
          transition={transition}
          className="fill-primary/75"
        />
        <motion.path
          initial={false}
          animate={{ d: areaPath(levels.in, WIDTH, HEIGHT) }}
          transition={transition}
          className="fill-tertiary/75"
        />

        <motion.line
          x1={playhead}
          x2={playhead}
          y1={-6}
          y2={HEIGHT}
          style={{ opacity: playheadOpacity }}
          className="stroke-on-surface stroke-2"
        />
      </svg>
    </div>
  );
}
