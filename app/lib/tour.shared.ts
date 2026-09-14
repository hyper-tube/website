import type { Theme } from './theme.shared';

export const TOUR_SCREENS = [
  'home',
  'player',
  'library',
  'search',
  'downloads',
  'settings',
] as const;

export type TourScreen = (typeof TOUR_SCREENS)[number];

export const TOUR_INTERVAL = 6000;
export const SCREENSHOT_SIZE = { width: 1792, height: 1120 } as const;
export const SCREENSHOT_WIDTHS = [720, 1200, 1792] as const;
export const SCREENSHOT_SIZES = '(min-width: 80rem) 77rem, calc(100vw - 2rem)';

export function screenshotPath(screen: TourScreen, theme: Theme, width = 1200): string {
  return `/screenshots/${theme}/${screen}-${width}.webp`;
}

export function screenshotSrcSet(screen: TourScreen, theme: Theme): string {
  return SCREENSHOT_WIDTHS.map((width) => `${screenshotPath(screen, theme, width)} ${width}w`).join(
    ', ',
  );
}
