import DownloadOutlineIcon from '~icons/material-symbols/download-for-offline-outline-rounded';
import PaletteOutlineIcon from '~icons/material-symbols/palette-outline-rounded';
import LyricsOutlineIcon from '~icons/material-symbols/lyrics-outline-rounded';
import DownloadIcon from '~icons/material-symbols/download-for-offline-rounded';
import EqualizerIcon from '~icons/material-symbols/equalizer-rounded';
import PaletteIcon from '~icons/material-symbols/palette-rounded';
import LyricsIcon from '~icons/material-symbols/lyrics-rounded';
import SwapIcon from '~icons/material-symbols/swap-horiz-rounded';
import { motion } from 'motion/react';

import type { PlaygroundFeature } from '~/lib/playground.shared';
import { TRANSITIONS } from '~/lib/motion.shared';
import { Ripple } from '~/components/ui/Ripple';
import { cn } from '~/lib/styles.shared';

interface DemoRailItemProps {
  feature: PlaygroundFeature;
  label: string;
  active: boolean;
  onSelect: () => void;
}

const ICONS = {
  colors: [PaletteOutlineIcon, PaletteIcon],
  transitions: [SwapIcon, SwapIcon],
  lyrics: [LyricsOutlineIcon, LyricsIcon],
  offline: [DownloadOutlineIcon, DownloadIcon],
  equalizer: [EqualizerIcon, EqualizerIcon],
} satisfies Record<PlaygroundFeature, unknown[]>;

const ITEM = cn(
  'state-layer relative grid h-8 w-14 place-items-center rounded-full',
  'transition-colors duration-200 ease-effects',
);

export function DemoRailItem({ feature, label, active, onSelect }: DemoRailItemProps) {
  const [Outline, Filled] = ICONS[feature];
  const Icon = active ? Filled : Outline;

  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? 'true' : undefined}
      title={label}
      onClick={onSelect}
      className={cn(ITEM, active ? 'text-on-secondary-container' : 'text-on-surface-variant')}
    >
      {active && (
        <motion.span
          layoutId="rail-indicator"
          transition={TRANSITIONS.spatial}
          className="absolute inset-0 -z-10 rounded-full bg-secondary-container"
        />
      )}

      <Ripple />
      <Icon aria-hidden className="size-6" />
    </button>
  );
}
