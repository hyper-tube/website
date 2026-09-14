import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

import { groupByPlatform, type ReleaseAsset } from '~/lib/releases.shared';
import { useMotionTransition } from '~/hooks/useMotionTransition';
import type { PlatformId } from '~/lib/platforms.shared';
import { TRANSITIONS } from '~/lib/motion.shared';

import { PlatformPanel } from './PlatformPanel';

interface PlatformGridProps {
  assets: readonly ReleaseAsset[];
  platform: PlatformId | null;
}

const ENTER = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } };

export function PlatformGrid({ assets, platform }: PlatformGridProps) {
  const { t } = useTranslation('download');
  const transition = useMotionTransition(TRANSITIONS.slowSpatial);

  return (
    <section aria-label={t('platforms.label')} className="grid gap-4 lg:grid-cols-3">
      {groupByPlatform(assets, platform).map((group, index) => (
        <motion.div
          key={group.platform}
          {...ENTER}
          transition={{ ...transition, delay: 0.06 * index }}
        >
          <PlatformPanel group={group} recommended={group.platform === platform} />
        </motion.div>
      ))}
    </section>
  );
}
