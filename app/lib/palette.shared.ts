import { Hct, TonalPalette, argbFromHex, hexFromArgb } from '@material/material-color-utilities';

export { DEFAULT_SEED } from './seed.shared';

type PaletteName = 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'neutralVariant' | 'error';

type ToneRule = readonly [palette: PaletteName, light: number, dark: number];

const ACCENT_RULES = (palette: PaletteName, name: string) =>
  ({
    [name]: [palette, 40, 80],
    [`on-${name}`]: [palette, 100, 20],
    [`${name}-container`]: [palette, 90, 30],
    [`on-${name}-container`]: [palette, 10, 90],
  }) satisfies Record<string, ToneRule>;

export const SCHEME_RULES: Record<string, ToneRule> = {
  ...ACCENT_RULES('primary', 'primary'),
  ...ACCENT_RULES('secondary', 'secondary'),
  ...ACCENT_RULES('tertiary', 'tertiary'),
  ...ACCENT_RULES('error', 'error'),

  background: ['neutral', 98, 6],
  'on-background': ['neutral', 10, 90],
  surface: ['neutral', 98, 6],
  'on-surface': ['neutral', 10, 90],
  'surface-dim': ['neutral', 87, 6],
  'surface-bright': ['neutral', 98, 24],
  'surface-container-lowest': ['neutral', 100, 4],
  'surface-container-low': ['neutral', 96, 10],
  'surface-container': ['neutral', 94, 12],
  'surface-container-high': ['neutral', 92, 17],
  'surface-container-highest': ['neutral', 90, 22],
  'surface-variant': ['neutralVariant', 90, 30],
  'on-surface-variant': ['neutralVariant', 30, 80],
  outline: ['neutralVariant', 50, 60],
  'outline-variant': ['neutralVariant', 80, 30],
  'inverse-surface': ['neutral', 20, 90],
  'inverse-on-surface': ['neutral', 95, 20],
  'inverse-primary': ['primary', 80, 40],
  shadow: ['neutral', 0, 0],
  scrim: ['neutral', 0, 0],
};

export type Scheme = Record<string, string>;

function palettesFrom(seed: string): Record<PaletteName, TonalPalette> {
  const { hue } = Hct.fromInt(argbFromHex(seed));

  return {
    primary: TonalPalette.fromHueAndChroma(hue, 36),
    secondary: TonalPalette.fromHueAndChroma(hue, 16),
    tertiary: TonalPalette.fromHueAndChroma(hue + 60, 24),
    neutral: TonalPalette.fromHueAndChroma(hue, 6),
    neutralVariant: TonalPalette.fromHueAndChroma(hue, 8),
    error: TonalPalette.fromHueAndChroma(25, 84),
  };
}

export function schemeFrom(seed: string, dark: boolean): Scheme {
  const palettes = palettesFrom(seed);

  return Object.fromEntries(
    Object.entries(SCHEME_RULES).map(([role, [palette, light, darkTone]]) => [
      role,
      hexFromArgb(palettes[palette].tone(dark ? darkTone : light)),
    ]),
  );
}

export function schemeProperties(scheme: Scheme): Record<string, string> {
  return Object.fromEntries(Object.entries(scheme).map(([role, hex]) => [`--md-${role}`, hex]));
}
