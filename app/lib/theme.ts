import { flushSync } from 'react-dom';

import { createCookie } from './cookie';
import {
  DEFAULT_THEME_PREFERENCE,
  THEME_COOKIE_MAX_AGE,
  THEME_COOKIE_NAME,
  isThemePreference,
  type Theme,
  type ThemePreference,
} from './theme.shared';

export const themeCookie = createCookie<ThemePreference>(THEME_COOKIE_NAME, {
  path: '/',
  sameSite: 'lax',
  maxAge: THEME_COOKIE_MAX_AGE,
  get: (value) => (isThemePreference(value) ? value : DEFAULT_THEME_PREFERENCE),
  set: (value) => value,
});

const DARK_QUERY = '(prefers-color-scheme: dark)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const REVEAL_DURATION = 520;
const REVEAL_EASING = 'cubic-bezier(0.2, 0, 0, 1)';

export function resolveTheme(preference: ThemePreference): Theme {
  if (preference !== 'system') return preference;

  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

export function revealTheme(commit: () => void, origin?: { x: number; y: number }): void {
  const canAnimate =
    typeof document.startViewTransition === 'function' &&
    !window.matchMedia(REDUCED_MOTION_QUERY).matches;

  if (!canAnimate || !origin) {
    commit();
    return;
  }

  const transition = document.startViewTransition(() => flushSync(commit));

  const radius = Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y),
  );

  void transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${origin.x}px ${origin.y}px)`,
          `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
        ],
      },
      {
        duration: REVEAL_DURATION,
        easing: REVEAL_EASING,
        pseudoElement: '::view-transition-new(root)',
      },
    );
  });
}
