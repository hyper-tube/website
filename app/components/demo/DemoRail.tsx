import { useTranslation } from 'react-i18next';
import { LayoutGroup } from 'motion/react';

import { PLAYGROUND_FEATURES, type PlaygroundFeature } from '~/lib/playground.shared';

import { DemoRailItem } from './DemoRailItem';

interface DemoRailProps {
  feature: PlaygroundFeature;
  onSelect: (feature: PlaygroundFeature) => void;
}

export function DemoRail({ feature, onSelect }: DemoRailProps) {
  const { t } = useTranslation('landing');

  return (
    <nav
      aria-label={t('playground.label')}
      className="flex flex-col items-center gap-2 pt-2 max-sm:hidden"
    >
      <LayoutGroup id="demo-rail">
        {PLAYGROUND_FEATURES.map((id) => (
          <DemoRailItem
            key={id}
            feature={id}
            label={t(`playground.features.${id}.title`)}
            active={id === feature}
            onSelect={() => onSelect(id)}
          />
        ))}
      </LayoutGroup>
    </nav>
  );
}
