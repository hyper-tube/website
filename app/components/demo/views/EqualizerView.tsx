import { useTranslation } from 'react-i18next';

import { SegmentedControl } from '~/components/ui/SegmentedControl';
import { EQ_PRESETS, type EqPreset } from '~/lib/playground.shared';
import { useDemoPlayer } from '~/providers/demo-player';
import { Switch } from '~/components/ui/Switch';

import { EqualizerBands } from './EqualizerBands';
import { ViewHeader } from './ViewHeader';

const PRESETS = Object.keys(EQ_PRESETS) as EqPreset[];

export function EqualizerView() {
  const { t } = useTranslation('landing');
  const { equalizer } = useDemoPlayer();

  const presets = PRESETS.map((id) => ({ id, label: t(`playground.equalizer.presets.${id}`) }));

  return (
    <div className="flex flex-col gap-5">
      <ViewHeader
        title={t('playground.equalizer.title')}
        action={
          <Switch
            checked={equalizer.enabled}
            onChange={equalizer.setEnabled}
            label={t('playground.equalizer.enabled')}
          />
        }
      />

      <SegmentedControl
        items={presets}
        value={equalizer.preset}
        onChange={equalizer.choosePreset}
        label={t('playground.equalizer.title')}
        size="sm"
        className="self-start overflow-x-auto max-sm:w-full"
      />

      <EqualizerBands
        gains={equalizer.gains}
        enabled={equalizer.enabled}
        onChange={equalizer.setBand}
      />
    </div>
  );
}
