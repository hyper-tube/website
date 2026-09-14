import 'i18next';
import { initReactI18next } from 'react-i18next';
import { createI18nextMiddleware } from 'remix-i18next';

import resources, { SUPPORTED_LOCALES } from '~/locales';
import { DEFAULT_LOCALE, DEFAULT_NAMESPACE, INTERPOLATION, NAMESPACES } from '~/lib/locale.shared';
import { localeCookie } from '~/lib/locale.server';

export const [i18nextMiddleware, getLocale, getInstance] = createI18nextMiddleware({
  detection: {
    supportedLanguages: SUPPORTED_LOCALES,
    fallbackLanguage: DEFAULT_LOCALE,
    cookie: localeCookie,
  },
  i18next: {
    resources,
    ns: NAMESPACES,
    defaultNS: DEFAULT_NAMESPACE,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: SUPPORTED_LOCALES,
    interpolation: INTERPOLATION,
  },
  plugins: [initReactI18next],
});

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof DEFAULT_NAMESPACE;
    resources: {
      common: typeof import('~/locales/en/common.json');
      landing: typeof import('~/locales/en/landing.json');
      download: typeof import('~/locales/en/download.json');
      changelog: typeof import('~/locales/en/changelog.json');
      faq: typeof import('~/locales/en/faq.json');
      legal: typeof import('~/locales/en/legal.json');
      errors: typeof import('~/locales/en/errors.json');
    };
  }
}
