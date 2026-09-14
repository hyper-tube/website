const FOCUSABLE_ITEM = '[role^="menuitem"]:not([aria-disabled="true"])';

const HORIZONTAL_STEPS: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };

const KEY_STEPS: Record<string, number | 'first' | 'last'> = {
  ArrowDown: 1,
  ArrowUp: -1,
  Home: 'first',
  End: 'last',
};

export function moveMenuFocus(container: HTMLElement, key: string): boolean {
  const step = KEY_STEPS[key];
  if (step === undefined) return false;

  const items = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_ITEM));
  if (items.length === 0) return false;

  const current = items.indexOf(document.activeElement as HTMLElement);

  const next =
    step === 'first'
      ? 0
      : step === 'last'
        ? items.length - 1
        : (current + step + items.length) % items.length;

  items[next].focus();

  return true;
}

export function focusInitialMenuItem(container: HTMLElement): void {
  const checked = container.querySelector<HTMLElement>('[aria-checked="true"]');
  const first = container.querySelector<HTMLElement>(FOCUSABLE_ITEM);

  (checked ?? first)?.focus();
}

export function nextHorizontalIndex(key: string, index: number, length: number): number | null {
  const step = HORIZONTAL_STEPS[key];

  return step === undefined ? null : (index + step + length) % length;
}
