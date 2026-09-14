import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

import { useMotionTransition } from '~/hooks/useMotionTransition';
import { EQ_RANGE } from '~/lib/playground.shared';
import { TRANSITIONS } from '~/lib/motion.shared';
import { cn } from '~/lib/styles.shared';

interface EqualizerSliderProps {
  gain: number;
  frequency: string;
  disabled: boolean;
  onChange: (gain: number) => void;
}

const KEY_STEPS: Record<string, number> = {
  ArrowUp: 1,
  ArrowRight: 1,
  ArrowDown: -1,
  ArrowLeft: -1,
};

const THUMB = cn(
  'absolute left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary',
  'transition-[scale] duration-200 ease-expressive-fast group-active:scale-125',
);

const ROOT = cn(
  'group relative flex h-40 w-8 cursor-pointer touch-none justify-center',
  'aria-disabled:cursor-default',
);

export function EqualizerSlider({ gain, frequency, disabled, onChange }: EqualizerSliderProps) {
  const { t } = useTranslation('landing');
  const transition = useMotionTransition(TRANSITIONS.slowSpatial);
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const fraction = (EQ_RANGE - gain) / (EQ_RANGE * 2);

  const update = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;

    const ratio = Math.min(Math.max((event.clientY - bounds.top) / bounds.height, 0), 1);

    onChange(Math.round(EQ_RANGE - ratio * EQ_RANGE * 2));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = KEY_STEPS[event.key];
    if (!step) return;

    event.preventDefault();
    onChange(Math.min(Math.max(gain + step, -EQ_RANGE), EQ_RANGE));
  };

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-orientation="vertical"
      aria-label={t('playground.equalizer.band', { frequency, gain })}
      aria-valuemin={-EQ_RANGE}
      aria-valuemax={EQ_RANGE}
      aria-valuenow={gain}
      aria-disabled={disabled}
      onPointerDown={(event) => {
        if (disabled) return;

        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
        update(event);
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      onPointerMove={(event) => !disabled && event.buttons === 1 && update(event)}
      onKeyDown={disabled ? undefined : onKeyDown}
      className={ROOT}
    >
      <span className="h-full w-1.5 rounded-full bg-surface-container-highest" />

      <motion.span
        initial={false}
        animate={{ top: `${fraction * 100}%` }}
        transition={dragging ? { duration: 0 } : transition}
        className={THUMB}
      />
    </div>
  );
}
