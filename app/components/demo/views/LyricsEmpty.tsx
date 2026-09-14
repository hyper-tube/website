import LyricsIcon from '~icons/material-symbols/lyrics-outline-rounded';
import PlayIcon from '~icons/material-symbols/play-arrow-rounded';
import { useTranslation } from 'react-i18next';

import { useDemoPlayer } from '~/providers/demo-player';
import { DEMO_TRACKS } from '~/lib/demo-songs.shared';
import { Button } from '~/components/ui/Button';

const WITH_LYRICS = DEMO_TRACKS.find((track) => track.lyrics);

export function LyricsEmpty() {
  const { t } = useTranslation('landing');
  const { play, isPlayable } = useDemoPlayer();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
      <LyricsIcon aria-hidden className="size-10 text-on-surface-variant" />
      <p className="text-title-medium text-on-surface">{t('playground.lyrics.empty')}</p>
      <p className="text-body-small text-on-surface-variant">{t('playground.lyrics.emptyHint')}</p>

      {WITH_LYRICS && (
        <Button
          variant="tonal"
          size="sm"
          disabled={!isPlayable(WITH_LYRICS)}
          onClick={() => play(WITH_LYRICS.id)}
          className="mt-3"
        >
          <PlayIcon aria-hidden />
          {t('playground.lyrics.playWithLyrics', { title: WITH_LYRICS.title })}
        </Button>
      )}
    </div>
  );
}
