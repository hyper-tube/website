export const THEME_COOKIE_NAME = 'theme';
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type Theme = 'light' | 'dark';

export type ThemePreference = Theme | 'system';

export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'system';

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}
