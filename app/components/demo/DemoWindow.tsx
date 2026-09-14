import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import type { Ref } from 'react';

import { useMotionTransition } from '~/hooks/useMotionTransition';
import type { PlaygroundFeature } from '~/lib/playground.shared';
import { useDemoTheme } from '~/hooks/useDemoTheme';
import { TRANSITIONS } from '~/lib/motion.shared';
import { cn } from '~/lib/styles.shared';

import { TransitionsView } from './views/TransitionsView';
import { EqualizerView } from './views/EqualizerView';
import { OfflineView } from './views/OfflineView';
import { ColorsView } from './views/ColorsView';
import { LyricsView } from './views/LyricsView';
import { DemoMiniPlayer } from './DemoMiniPlayer';
import { DemoTitleBar } from './DemoTitleBar';
import { DemoRail } from './DemoRail';

interface DemoWindowProps {
  ref?: Ref<HTMLElement>;
  feature: PlaygroundFeature;
  onFeatureChange: (feature: PlaygroundFeature) => void;
  className?: string;
}

const WINDOW = cn(
  'theme-transition flex flex-col overflow-hidden rounded-verylarge',
  'bg-background text-on-background ring-1 ring-outline-variant/70 dark:ring-outline-variant',
  'shadow-[0_30px_80px_-30px_rgb(0_0_0/0.35)]',
);

const PAGE = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export function DemoWindow({ ref, feature, onFeatureChange, className }: DemoWindowProps) {
  const { t } = useTranslation('landing');
  const theme = useDemoTheme();
  const enter = useMotionTransition(TRANSITIONS.enter);
  const exit = useMotionTransition(TRANSITIONS.exit);

  return (
    <section
      ref={ref}
      aria-label={t('playground.window')}
      {...theme.attributes}
      className={cn(WINDOW, className)}
    >
      <DemoTitleBar />

      <div className="grid min-h-0 grid-cols-1 sm:grid-cols-[5.5rem_1fr]">
        <DemoRail feature={feature} onSelect={onFeatureChange} />

        <div className="relative h-[27rem] overflow-hidden px-5 pb-4 sm:pr-7 sm:pl-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={feature}
              {...PAGE}
              transition={enter}
              exit={{ ...PAGE.exit, transition: exit }}
              className="h-full"
            >
              {feature === 'colors' && (
                <ColorsView
                  seed={theme.seed}
                  mode={theme.mode}
                  onSeedChange={theme.setSeed}
                  onModeChange={theme.setMode}
                />
              )}
              {feature === 'transitions' && <TransitionsView />}
              {feature === 'lyrics' && <LyricsView />}
              {feature === 'offline' && <OfflineView />}
              {feature === 'equalizer' && <EqualizerView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <DemoMiniPlayer />
    </section>
  );
}
