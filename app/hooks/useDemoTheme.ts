import { useState, type CSSProperties } from 'react';

import type { ThemePreference } from '~/lib/theme.shared';
import { DEFAULT_SEED } from '~/lib/playground.shared';
import { resolveTheme } from '~/lib/theme';
import { useTheme } from '~/providers/theme';

interface GeneratedSchemes {
  readonly seed: string;
  readonly light: CSSProperties;
  readonly dark: CSSProperties;
}

interface DemoTheme {
  seed: string;
  mode: ThemePreference;
  setSeed: (seed: string) => void;
  setMode: (mode: ThemePreference) => void;
  attributes: { 'data-theme'?: ThemePreference; style?: CSSProperties };
}

export function useDemoTheme(): DemoTheme {
  const { preference } = useTheme();

  const [seed, setSeedState] = useState(DEFAULT_SEED);
  const [mode, setMode] = useState<ThemePreference>('system');
  const [schemes, setSchemes] = useState<GeneratedSchemes | null>(null);

  const setSeed = async (next: string) => {
    setSeedState(next);
    if (next === DEFAULT_SEED) return;

    const { schemeFrom, schemeProperties } = await import('~/lib/palette.shared');

    setSchemes({
      seed: next,
      light: schemeProperties(schemeFrom(next, false)),
      dark: schemeProperties(schemeFrom(next, true)),
    });
  };

  const custom = seed !== DEFAULT_SEED && schemes?.seed === seed ? schemes : null;
  const dark = custom && resolveTheme(mode === 'system' ? preference : mode) === 'dark';

  return {
    seed,
    mode,
    setSeed: (next) => void setSeed(next),
    setMode,
    attributes: {
      'data-theme': mode === 'system' ? undefined : mode,
      style: custom ? (dark ? custom.dark : custom.light) : undefined,
    },
  };
}
