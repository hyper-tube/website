import PlayIcon from '~icons/material-symbols/play-arrow-rounded';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import { TRANSITION_MODES, type TransitionPair } from '~/lib/transitions.shared';
import { SegmentedControl } from '~/components/ui/SegmentedControl';
import { useMotionTransition } from '~/hooks/useMotionTransition';
import { useDemoPlayer } from '~/providers/demo-player';
import { TRANSITIONS } from '~/lib/motion.shared';
import { Button } from '~/components/ui/Button';

import { TransitionChart } from './TransitionChart';
import { ViewHeader } from './ViewHeader';

const SWAP = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const captionKey = (pair: TransitionPair | null) => {
  if (!pair) return 'nothingNext';
  if (pair.plan.kind === 'fade') return 'smartFade';
  if (pair.plan.kind === 'beatmix') return 'smart';

  return pair.plan.kind === 'gapless' ? 'off' : 'crossfade';
};

export function TransitionsView() {
  const { t } = useTranslation('landing');
  const transition = useMotionTransition(TRANSITIONS.enter);
  const { mode, setMode, pair, transitioning, previewTransition } = useDemoPlayer();

  const modes = TRANSITION_MODES.map((id) => ({ id, label: t(`playground.transitions.${id}`) }));
  const caption = captionKey(pair);

  return (
    <div className="flex flex-col gap-6">
      <ViewHeader
        title={t('playground.transitions.title')}
        action={
          <SegmentedControl
            items={modes}
            value={mode}
            onChange={setMode}
            label={t('playground.transitions.title')}
            size="sm"
          />
        }
      />

      {pair ? <TransitionChart pair={pair} /> : <div className="h-[11.5rem]" />}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-h-12 flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={caption}
              {...SWAP}
              transition={transition}
              className="max-w-sm text-body-medium text-on-surface-variant"
            >
              {t(`playground.transitions.caption.${caption}`)}
            </motion.p>
          </AnimatePresence>
        </div>

        <Button
          variant="tonal"
          size="sm"
          disabled={!pair || transitioning}
          onClick={previewTransition}
        >
          <PlayIcon aria-hidden />
          {t('playground.transitions.preview')}
        </Button>
      </div>
    </div>
  );
}
