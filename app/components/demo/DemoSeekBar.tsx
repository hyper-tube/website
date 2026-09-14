import { motion, useTransform, type MotionValue } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useRef, type KeyboardEvent, type PointerEvent } from 'react';

import { useWholeSeconds } from '~/hooks/useWholeSeconds';
import { cn } from '~/lib/styles.shared';

interface DemoSeekBarProps {
  position: MotionValue<number>;
  duration: number;
  onSeek: (seconds: number) => void;
  className?: string;
}

const KEY_STEP = 5;

const HANDLE = cn(
  'absolute size-3 -translate-x-1/2 scale-0 rounded-full bg-primary',
  'transition-transform duration-200 ease-expressive-fast',
  'group-hover:scale-100 group-focus-visible:scale-100',
);

const TRACK = 'relative h-1 w-full overflow-hidden rounded-full bg-surface-container-highest';

export function DemoSeekBar({ position, duration, onSeek, className }: DemoSeekBarProps) {
  const { t } = useTranslation('landing');
  const ref = useRef<HTMLDivElement>(null);

  const scaleX = useTransform(position, (value) => value / duration);
  const left = useTransform(position, (value) => `${(value / duration) * 100}%`);
  const seconds = useWholeSeconds(position);

  const seekTo = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;

    onSeek(((event.clientX - bounds.left) / bounds.width) * duration);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === 'ArrowRight' ? KEY_STEP : event.key === 'ArrowLeft' ? -KEY_STEP : 0;
    if (!step) return;

    event.preventDefault();
    onSeek(position.get() + step);
  };

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label={t('playground.player.seek')}
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={seconds}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        seekTo(event);
      }}
      onPointerMove={(event) => event.buttons === 1 && seekTo(event)}
      onKeyDown={onKeyDown}
      className={cn('group relative flex h-4 cursor-pointer touch-none items-center', className)}
    >
      <div className={TRACK}>
        <motion.div
          style={{ scaleX }}
          className="absolute inset-0 origin-left rounded-full bg-primary"
        />
      </div>

      <motion.span style={{ left }} className={HANDLE} />
    </div>
  );
}
