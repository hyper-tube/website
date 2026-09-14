import { useTranslation } from 'react-i18next';
import { LayoutGroup } from 'motion/react';

import { PLAYGROUND_FEATURES, type PlaygroundFeature } from '~/lib/playground.shared';

import { FeatureItem } from './FeatureItem';

interface FeatureListProps {
  value: PlaygroundFeature;
  onChange: (feature: PlaygroundFeature) => void;
}

export function FeatureList({ value, onChange }: FeatureListProps) {
  const { t } = useTranslation('landing');

  return (
    <ol aria-label={t('playground.label')} className="flex flex-col">
      <LayoutGroup id="playground-features">
        {PLAYGROUND_FEATURES.map((feature, index) => (
          <FeatureItem
            key={feature}
            index={index}
            title={t(`playground.features.${feature}.title`)}
            description={t(`playground.features.${feature}.description`)}
            active={feature === value}
            onSelect={() => onChange(feature)}
          />
        ))}
      </LayoutGroup>
    </ol>
  );
}
