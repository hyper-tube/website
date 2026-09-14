export const LOCALE_COOKIE_NAME = 'locale';
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
export const DEFAULT_LOCALE = 'en';

export const NAMESPACES = [
  'common',
  'landing',
  'download',
  'changelog',
  'faq',
  'legal',
  'errors',
] as const;

export const DEFAULT_NAMESPACE = 'common';

export const INTERPOLATION = { escapeValue: false } as const;

export const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  ru: 'Русский',
  uk: 'Українська',
};
