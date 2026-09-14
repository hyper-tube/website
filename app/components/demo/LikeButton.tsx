import FavoriteOutlineIcon from '~icons/material-symbols/favorite-outline-rounded';
import FavoriteIcon from '~icons/material-symbols/favorite-rounded';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import { useDemoPlayer } from '~/providers/demo-player';
import { TRANSITIONS } from '~/lib/motion.shared';
import { Button } from '~/components/ui/Button';

interface LikeButtonProps {
  trackId: string;
}

const POP = {
  initial: { scale: 0.3 },
  animate: { scale: 1 },
  exit: { scale: 0.3, opacity: 0 },
};

export function LikeButton({ trackId }: LikeButtonProps) {
  const { t } = useTranslation('landing');
  const { liked, toggleLike } = useDemoPlayer();

  const isLiked = liked.has(trackId);

  return (
    <Button
      variant="standard"
      icon
      aria-pressed={isLiked}
      aria-label={isLiked ? t('playground.player.unlike') : t('playground.player.like')}
      onClick={() => toggleLike(trackId)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={String(isLiked)}
          {...POP}
          transition={TRANSITIONS.fastSpatial}
          className="grid"
        >
          {isLiked ? (
            <FavoriteIcon aria-hidden className="text-primary" />
          ) : (
            <FavoriteOutlineIcon aria-hidden />
          )}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
