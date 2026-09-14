import { createCookie } from './cookie.server';
import {
  DEFAULT_THEME_PREFERENCE,
  THEME_COOKIE_MAX_AGE,
  THEME_COOKIE_NAME,
  isThemePreference,
  type ThemePreference,
} from './theme.shared';

const themeCookie = createCookie<ThemePreference>(THEME_COOKIE_NAME, {
  path: '/',
  sameSite: 'lax',
  maxAge: THEME_COOKIE_MAX_AGE,
  secure: import.meta.env.PROD,
  parse: (value) => (isThemePreference(value) ? value : DEFAULT_THEME_PREFERENCE),
  serialize: (value) => value,
});

export function getThemeFromRequest(request: Request): ThemePreference {
  return themeCookie.parse(request) ?? DEFAULT_THEME_PREFERENCE;
}
