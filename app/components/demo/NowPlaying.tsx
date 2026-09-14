import { AnimatePresence, motion } from 'motion/react';

import { useMotionTransition } from '~/hooks/useMotionTransition';
import { useDemoPlayer } from '~/providers/demo-player';
import { TRANSITIONS } from '~/lib/motion.shared';

import { DemoArtwork } from './DemoArtwork';

const SWAP = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export function NowPlaying() {
  const { track } = useDemoPlayer();
  const transition = useMotionTransition(TRANSITIONS.enter);

  return (
    <div className="relative flex h-12 min-w-0 flex-1 items-center overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={track.id}
          {...SWAP}
          transition={transition}
          className="flex min-w-0 items-center gap-3"
        >
          <DemoArtwork cover={track.cover} className="size-11 rounded-small" />

          <div className="flex min-w-0 flex-col">
            <span className="truncate text-title-small text-on-surface">{track.title}</span>
            <span className="truncate text-body-small text-on-surface-variant">{track.artist}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
