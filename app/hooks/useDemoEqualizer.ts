import { useState } from 'react';

import { EQ_PRESETS, type EqPreset } from '~/lib/playground.shared';

export type EqualizerPreset = EqPreset | 'custom';

export interface DemoEqualizer {
  readonly enabled: boolean;
  readonly preset: EqualizerPreset;
  readonly gains: readonly number[];
  setEnabled: (enabled: boolean) => void;
  choosePreset: (preset: EqualizerPreset) => void;
  setBand: (band: number, gain: number) => void;
}

export function useDemoEqualizer(): DemoEqualizer {
  const [enabled, setEnabled] = useState(true);
  const [preset, setPreset] = useState<EqualizerPreset>('flat');
  const [gains, setGains] = useState<readonly number[]>(EQ_PRESETS.flat);

  return {
    enabled,
    preset,
    gains,
    setEnabled,
    choosePreset: (next) => {
      if (next === 'custom') return;

      setPreset(next);
      setGains(EQ_PRESETS[next]);
    },
    setBand: (band, gain) => {
      setPreset('custom');
      setGains((current) => current.map((value, index) => (index === band ? gain : value)));
    },
  };
}
