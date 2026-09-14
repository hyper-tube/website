import SkipPreviousIcon from '~icons/material-symbols/skip-previous-rounded';
import SkipNextIcon from '~icons/material-symbols/skip-next-rounded';
import { useTranslation } from 'react-i18next';

import { useDemoPlayer } from '~/providers/demo-player';
import { Button } from '~/components/ui/Button';
import { cn } from '~/lib/styles.shared';

import { PlayPauseButton } from './PlayPauseButton';
import { NowPlaying } from './NowPlaying';
import { DemoSeekBar } from './DemoSeekBar';
import { LikeButton } from './LikeButton';
import { TimeReadout } from './TimeReadout';

const BAR = cn(
  'mx-3 mb-3 flex flex-col gap-1 rounded-large bg-surface-container',
  'px-3 pt-1.5 pb-2.5 sm:px-4',
);

export function DemoMiniPlayer() {
  const { t } = useTranslation('landing');
  const { track, playing, position, toggle, step, seek } = useDemoPlayer();

  return (
    <div className={BAR}>
      <DemoSeekBar position={position} duration={track.duration} onSeek={seek} />

      <div className="flex items-center gap-2">
        <NowPlaying />

        <div className="flex items-center gap-1">
          <Button
            variant="standard"
            icon
            aria-label={t('playground.player.previous')}
            onClick={() => step(-1)}
          >
            <SkipPreviousIcon aria-hidden />
          </Button>

          <PlayPauseButton playing={playing} onToggle={toggle} />

          <Button
            variant="standard"
            icon
            aria-label={t('playground.player.next')}
            onClick={() => step(1)}
          >
            <SkipNextIcon aria-hidden />
          </Button>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 max-sm:hidden">
          <TimeReadout />
          <LikeButton trackId={track.id} />
        </div>
      </div>
    </div>
  );
}
