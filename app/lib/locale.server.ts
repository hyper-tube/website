import type { Cookie } from 'react-router';

import resources from '~/locales';
import { createCookie } from '~/lib/cookie.server';

import { DEFAULT_LOCALE, LOCALE_COOKIE_MAX_AGE, LOCALE_COOKIE_NAME } from './locale.shared';

export function isSupportedLocale(value: unknown): value is string {
  return typeof value === 'string' && Object.hasOwn(resources, value);
}

const localeStorage = createCookie<string>(LOCALE_COOKIE_NAME, {
  path: '/',
  sameSite: 'lax',
  maxAge: LOCALE_COOKIE_MAX_AGE,
  secure: import.meta.env.PROD,
  parse: (value) => (isSupportedLocale(value) ? value : DEFAULT_LOCALE),
  serialize: (value) => (isSupportedLocale(value) ? value : DEFAULT_LOCALE),
});

export const localeCookie = {
  name: localeStorage.name,
  isSigned: false,
  async parse(cookieHeader: string | null) {
    return localeStorage.parseHeader(cookieHeader) ?? null;
  },
  async serialize(value: unknown) {
    return localeStorage.serialize(isSupportedLocale(value) ? value : DEFAULT_LOCALE);
  },
} satisfies Cookie;
