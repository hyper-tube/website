import { createCookie } from './cookie';
import { LOCALE_COOKIE_MAX_AGE, LOCALE_COOKIE_NAME } from './locale.shared';

export const localeCookie = createCookie<string>(LOCALE_COOKIE_NAME, {
  path: '/',
  sameSite: 'lax',
  maxAge: LOCALE_COOKIE_MAX_AGE,
});
