import { useEffect, useRef } from 'react';
import { animate } from 'motion/react';
import { useTranslation } from 'react-i18next';

import { useMotionTransition } from '~/hooks/useMotionTransition';
import type { LyricLine } from '~/lib/playground.shared';
import { useDemoPlayer } from '~/providers/demo-player';
import { useLyricIndex } from '~/hooks/useLyricIndex';
import { TRANSITIONS } from '~/lib/motion.shared';
import { cn } from '~/lib/styles.shared';

interface LyricsLinesProps {
  lines: readonly LyricLine[];
}

const ANCHOR = 0.28;

const LINE = cn(
  'block w-full origin-left rounded-small px-2 py-1.5 text-left text-headline-small',
  'transition-[color,opacity,scale] duration-500 ease-emphasized hover:bg-on-surface/5',
);

export function LyricsLines({ lines }: LyricsLinesProps) {
  const { t } = useTranslation('landing');
  const { position, seek, play, track } = useDemoPlayer();
  const transition = useMotionTransition(TRANSITIONS.emphasized);

  const viewport = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);

  const current = useLyricIndex(lines, position);

  useEffect(() => {
    const line = list.current?.children[current] as HTMLElement | undefined;
    const height = viewport.current?.clientHeight ?? 0;

    if (!line || !list.current) return;

    const controls = animate(list.current, { y: height * ANCHOR - line.offsetTop }, transition);

    return () => controls.stop();
  }, [current, transition]);

  const jump = (time: number) => {
    seek(time);
    play(track.id);
  };

  return (
    <div ref={viewport} className="relative min-h-0 flex-1 overflow-clip">
      <ol ref={list} className="flex flex-col gap-1">
        {lines.map((line, index) => (
          <li key={`${line.time}-${index}`}>
            <button
              type="button"
              aria-label={`${t('playground.lyrics.jump')}: ${line.text}`}
              aria-current={index === current ? 'true' : undefined}
              onClick={() => jump(line.time)}
              className={cn(
                LINE,
                index === current
                  ? 'text-on-surface'
                  : 'scale-[0.94] text-on-surface-variant opacity-45',
              )}
            >
              {line.text}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
