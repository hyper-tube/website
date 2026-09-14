const SMALL_SCREEN = '(max-width: 63.99rem)';

export function revealOnSmallScreens(element: HTMLElement | null): void {
  if (!element || !window.matchMedia(SMALL_SCREEN).matches) return;

  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
