import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import { DEFAULT_SEED, DEMO_SEEDS } from '~/lib/playground.shared';
import { SegmentedControl } from '~/components/ui/SegmentedControl';
import type { ThemePreference } from '~/lib/theme.shared';
import { Switch } from '~/components/ui/Switch';

import { ColorSwatch } from './ColorSwatch';
import { SettingRow } from './SettingRow';
import { ViewHeader } from './ViewHeader';

interface ColorsViewProps {
  seed: string;
  mode: ThemePreference;
  onSeedChange: (seed: string) => void;
  onModeChange: (mode: ThemePreference) => void;
}

const MODES = ['system', 'light', 'dark'] as const;

export function ColorsView({ seed, mode, onSeedChange, onModeChange }: ColorsViewProps) {
  const { t } = useTranslation('landing');
  const [following, setFollowing] = useState(false);

  const modes = MODES.map((id) => ({ id, label: t(`playground.colors.${id}`) }));

  const follow = (next: boolean) => {
    setFollowing(next);
    if (next) onSeedChange(DEFAULT_SEED);
  };

  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title={t('playground.colors.title')} />

      <SettingRow title={t('playground.colors.mode')}>
        <SegmentedControl
          items={modes}
          value={mode}
          onChange={onModeChange}
          label={t('playground.colors.mode')}
          size="sm"
        />
      </SettingRow>

      <SettingRow title={t('playground.colors.follow')} hint={t('playground.colors.followHint')}>
        <Switch checked={following} onChange={follow} label={t('playground.colors.follow')} />
      </SettingRow>

      <div className="flex flex-col gap-3">
        <span className="text-title-medium text-on-surface">{t('playground.colors.accent')}</span>

        <div
          role="radiogroup"
          aria-label={t('playground.colors.accent')}
          className="flex flex-wrap gap-3"
        >
          {DEMO_SEEDS.map((color) => (
            <ColorSwatch
              key={color}
              color={color}
              label={t('playground.colors.swatch', { color })}
              selected={!following && color === seed}
              disabled={following}
              onSelect={() => onSeedChange(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
