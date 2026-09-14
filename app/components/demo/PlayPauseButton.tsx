import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import { Ripple } from '~/components/ui/Ripple';
import { TRANSITIONS } from '~/lib/motion.shared';
import { cn } from '~/lib/styles.shared';

interface PlayPauseButtonProps {
  playing: boolean;
  onToggle: () => void;
  className?: string;
}

const SHAPES = {
  play: ['M8.5 5.5 L13.6 8.7 L13.6 15.3 L8.5 18.5 Z', 'M13.6 8.7 L19 12 L19 12 L13.6 15.3 Z'],
  pause: ['M7 5.5 L10.6 5.5 L10.6 18.5 L7 18.5 Z', 'M13.4 5.5 L17 5.5 L17 18.5 L13.4 18.5 Z'],
};

const BUTTON = cn(
  'state-layer grid size-12 shrink-0 place-items-center rounded-[24px] bg-primary text-on-primary',
  'transition-[scale,border-radius] duration-350 ease-expressive-fast active:scale-90',
  'data-[playing=true]:rounded-normal',
);

export function PlayPauseButton({ playing, onToggle, className }: PlayPauseButtonProps) {
  const { t } = useTranslation('landing');
  const shape = playing ? SHAPES.pause : SHAPES.play;

  return (
    <button
      type="button"
      data-playing={playing}
      aria-label={playing ? t('playground.player.pause') : t('playground.player.play')}
      onClick={onToggle}
      className={cn(BUTTON, className)}
    >
      <Ripple />

      <svg viewBox="0 0 24 24" aria-hidden className="size-6">
        {shape.map((d, index) => (
          <motion.path
            key={index}
            initial={false}
            animate={{ d }}
            transition={TRANSITIONS.fastSpatial}
            className="fill-current stroke-current stroke-[1.4] [stroke-linejoin:round]"
          />
        ))}
      </svg>
    </button>
  );
}
