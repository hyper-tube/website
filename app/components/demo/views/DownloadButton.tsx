import DownloadDoneIcon from '~icons/material-symbols/download-done-rounded';
import DownloadIcon from '~icons/material-symbols/download-rounded';
import { AnimatePresence, motion, useMotionValue } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import type { DemoTrack } from '~/lib/playground.shared';
import { useDemoPlayer } from '~/providers/demo-player';
import { downloadWithProgress } from '~/lib/download';
import { TRANSITIONS } from '~/lib/motion.shared';
import { Button } from '~/components/ui/Button';

interface DownloadButtonProps {
  track: DemoTrack;
}

const GLYPH = {
  initial: { scale: 0.4, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.4, opacity: 0 },
};

export function DownloadButton({ track }: DownloadButtonProps) {
  const { t } = useTranslation('landing');
  const { downloaded, markDownloaded, offline } = useDemoPlayer();

  const progress = useMotionValue(0);
  const [downloading, setDownloading] = useState(false);

  const done = downloaded.has(track.id);
  const state = done ? 'done' : downloading ? 'progress' : 'idle';

  const start = () => {
    setDownloading(true);

    void downloadWithProgress(track.src, (fraction) => progress.set(fraction))
      .then(() => markDownloaded(track.id))
      .catch(() => progress.set(0))
      .finally(() => setDownloading(false));
  };

  return (
    <Button
      variant="standard"
      icon
      disabled={offline && !done}
      aria-label={
        done
          ? t('playground.offline.downloaded', { title: track.title })
          : t('playground.offline.download', { title: track.title })
      }
      onClick={state === 'idle' ? start : undefined}
      className={done ? 'text-primary' : undefined}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={state}
          {...GLYPH}
          transition={TRANSITIONS.fastSpatial}
          className="grid place-items-center"
        >
          {state === 'done' && <DownloadDoneIcon aria-hidden />}
          {state === 'idle' && <DownloadIcon aria-hidden />}
          {state === 'progress' && (
            <svg viewBox="0 0 24 24" aria-hidden className="size-6 -rotate-90">
              <circle
                cx="12"
                cy="12"
                r="9"
                className="fill-none stroke-surface-container-highest stroke-[2.5]"
              />
              <motion.circle
                cx="12"
                cy="12"
                r="9"
                pathLength={1}
                style={{ pathLength: progress }}
                className="fill-none stroke-primary stroke-[2.5] [stroke-linecap:round]"
              />
            </svg>
          )}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
