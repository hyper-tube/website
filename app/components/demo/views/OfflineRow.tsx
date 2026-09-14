import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import { formatTime, type DemoTrack } from '~/lib/playground.shared';
import { PlayingBars } from '~/components/demo/PlayingBars';
import { DemoArtwork } from '~/components/demo/DemoArtwork';
import { useDemoPlayer } from '~/providers/demo-player';
import { TRANSITIONS } from '~/lib/motion.shared';
import { Ripple } from '~/components/ui/Ripple';
import { cn } from '~/lib/styles.shared';

import { DownloadButton } from './DownloadButton';

interface OfflineRowProps {
  track: DemoTrack;
}

const ROW = cn(
  'state-layer flex min-w-0 flex-1 items-center gap-3 rounded-normal py-1.5 pr-2 pl-1.5',
  'text-left disabled:cursor-not-allowed',
);

const CUE = cn(
  'absolute inset-0 grid place-items-center rounded-verysmall',
  'bg-surface-container-low/70 text-primary',
);

export function OfflineRow({ track }: OfflineRowProps) {
  const { t } = useTranslation('landing');
  const player = useDemoPlayer();

  const current = player.track.id === track.id;
  const playable = player.isPlayable(track);

  return (
    <motion.li
      initial={false}
      animate={{ opacity: playable ? 1 : 0.55 }}
      transition={TRANSITIONS.effects}
      className="flex items-center gap-1"
    >
      <button
        type="button"
        disabled={!playable}
        onClick={() => player.play(track.id)}
        className={ROW}
      >
        <Ripple />

        <span className="relative">
          <DemoArtwork cover={track.cover} className="size-10 rounded-verysmall" />
          {current && (
            <span className={CUE}>
              <PlayingBars playing={player.playing} />
            </span>
          )}
        </span>

        <span className="flex min-w-0 flex-1 flex-col">
          <span
            className={
              current
                ? 'truncate text-title-small text-primary'
                : 'truncate text-title-small text-on-surface'
            }
          >
            {track.title}
          </span>
          <span className="truncate text-body-small text-on-surface-variant">
            {playable ? track.artist : t('playground.offline.unavailable')}
          </span>
        </span>

        <span className="text-label-medium text-on-surface-variant tabular-nums">
          {formatTime(track.duration)}
        </span>
      </button>

      <DownloadButton track={track} />
    </motion.li>
  );
}
