import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { startTransition, StrictMode } from 'react';
import { HydratedRouter } from 'react-router/dom';
import { hydrateRoot } from 'react-dom/client';
import i18next from 'i18next';

import { DEFAULT_LOCALE, DEFAULT_NAMESPACE, INTERPOLATION, NAMESPACES } from '~/lib/locale.shared';
import resources, { SUPPORTED_LOCALES } from '~/locales';

async function main() {
  await i18next
    .use(initReactI18next)
    .use(I18nextBrowserLanguageDetector)
    .init({
      resources,
      supportedLngs: SUPPORTED_LOCALES,
      fallbackLng: DEFAULT_LOCALE,
      defaultNS: DEFAULT_NAMESPACE,
      ns: NAMESPACES,
      interpolation: INTERPOLATION,
      detection: { order: ['htmlTag'], caches: [] },
    });

  startTransition(() => {
    hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <StrictMode>
          <HydratedRouter />
        </StrictMode>
      </I18nextProvider>,
    );
  });
}

main().catch(console.error);
