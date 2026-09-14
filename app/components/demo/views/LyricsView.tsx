import { useTranslation } from 'react-i18next';

import { useDemoPlayer } from '~/providers/demo-player';

import { LyricsEmpty } from './LyricsEmpty';
import { LyricsLines } from './LyricsLines';
import { ViewHeader } from './ViewHeader';

export function LyricsView() {
  const { t } = useTranslation('landing');
  const { track } = useDemoPlayer();

  return (
    <div className="flex h-full flex-col gap-4">
      <ViewHeader title={t('playground.lyrics.title')} />

      {track.lyrics ? (
        <>
          <LyricsLines key={track.id} lines={track.lyrics} />
          <p className="text-body-small text-on-surface-variant">
            {t('playground.lyrics.source', { author: track.lyricist })}
          </p>
        </>
      ) : (
        <LyricsEmpty />
      )}
    </div>
  );
}
