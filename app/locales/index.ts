import type { Resource } from 'i18next';

import { LOCALE_NAMES } from '~/lib/locale.shared';

type Namespace = Record<string, unknown>;

const localeFiles = import.meta.glob<Namespace>('./*/*.json', {
  eager: true,
  import: 'default',
});

const resources: Resource = {};

for (const [path, namespace] of Object.entries(localeFiles)) {
  const [, locale, file] = path.split('/');
  const name = file.replace(/\.json$/, '');

  resources[locale] ??= {};
  resources[locale][name] = namespace;
}

const order = Object.keys(LOCALE_NAMES);

export const SUPPORTED_LOCALES = Object.keys(resources).sort(
  (a, b) => order.indexOf(a) - order.indexOf(b),
);

export default resources;
