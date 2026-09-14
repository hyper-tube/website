import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useId, useState } from 'react';

import { primaryAsset, type ReleaseAsset } from '~/lib/releases.shared';
import { useMotionTransition } from '~/hooks/useMotionTransition';
import type { PackageFormat, PlatformId } from '~/lib/platforms.shared';
import { panelId, tabId, Tabs } from '~/components/ui/Tabs';
import { TRANSITIONS } from '~/lib/motion.shared';

import { InstallSteps } from './InstallSteps';

interface InstallGuideProps {
  assets: readonly ReleaseAsset[];
  platform: PlatformId | null;
}

const PANEL_MOTION = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function initialFormat(assets: readonly ReleaseAsset[], platform: PlatformId | null) {
  return (platform && primaryAsset(assets, platform)?.format) || assets[0]?.format;
}

export function InstallGuide({ assets, platform }: InstallGuideProps) {
  const { t } = useTranslation('download');
  const transition = useMotionTransition(TRANSITIONS.enter);
  const idPrefix = useId().replaceAll(':', '');

  const [format, setFormat] = useState<PackageFormat | undefined>(() =>
    initialFormat(assets, platform),
  );

  const asset = assets.find((candidate) => candidate.format === format);
  const tabs = assets.map((item) => ({ id: item.format, label: t(`formats.${item.format}.tab`) }));

  if (!asset || !format) return null;

  return (
    <section className="grid gap-8 lg:grid-cols-[20rem_1fr] lg:gap-16">
      <header className="flex flex-col gap-3">
        <h2 className="text-headline-large">{t('install.title')}</h2>
        <p className="text-body-large text-on-surface-variant">{t('install.description')}</p>
      </header>

      <div className="flex min-w-0 flex-col gap-6">
        <Tabs
          items={tabs}
          value={format}
          onChange={setFormat}
          idPrefix={idPrefix}
          label={t('install.label')}
        />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={format}
            role="tabpanel"
            id={panelId(idPrefix, format)}
            aria-labelledby={tabId(idPrefix, format)}
            {...PANEL_MOTION}
            transition={transition}
          >
            <InstallSteps asset={asset} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
