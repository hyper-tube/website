import { motion } from 'motion/react';

import { EQ_BANDS, EQ_RANGE } from '~/lib/playground.shared';
import { useMotionTransition } from '~/hooks/useMotionTransition';
import { TRANSITIONS } from '~/lib/motion.shared';
import { curvePath } from '~/lib/shapes.shared';
import { cn } from '~/lib/styles.shared';

import { EqualizerSpectrum } from './EqualizerSpectrum';
import { EqualizerSlider } from './EqualizerSlider';

interface EqualizerBandsProps {
  gains: readonly number[];
  enabled: boolean;
  onChange: (band: number, gain: number) => void;
}

const WIDTH = 900;
const HEIGHT = 160;

const frequencyLabel = (hertz: number) => (hertz >= 1000 ? `${hertz / 1000}k` : String(hertz));

export function EqualizerBands({ gains, enabled, onChange }: EqualizerBandsProps) {
  const transition = useMotionTransition(TRANSITIONS.slowSpatial);

  const normalized = gains.map((gain) => gain / EQ_RANGE);

  return (
    <div
      className={cn(
        'relative transition-opacity duration-200 ease-effects',
        !enabled && 'opacity-40',
      )}
    >
      <EqualizerSpectrum />

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden
        className="pointer-events-none absolute inset-x-[5%] top-0 h-40 w-[90%] overflow-visible"
      >
        <line
          x1={0}
          x2={WIDTH}
          y1={HEIGHT / 2}
          y2={HEIGHT / 2}
          className="stroke-outline-variant stroke-1 [stroke-dasharray:6_6]"
        />
        <motion.path
          initial={false}
          animate={{ d: curvePath(normalized, WIDTH, HEIGHT) }}
          transition={transition}
          className="fill-none stroke-primary/40 stroke-[3] [vector-effect:non-scaling-stroke]"
        />
      </svg>

      <div className="relative grid grid-cols-10">
        {EQ_BANDS.map((hertz, index) => (
          <div key={hertz} className="flex flex-col items-center gap-2">
            <EqualizerSlider
              gain={gains[index]}
              frequency={frequencyLabel(hertz)}
              disabled={!enabled}
              onChange={(gain) => onChange(index, gain)}
            />
            <span className="text-label-small text-on-surface-variant">
              {frequencyLabel(hertz)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
