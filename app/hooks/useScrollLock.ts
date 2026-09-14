import { useEffect } from 'react';

export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const { style } = document.documentElement;
    const previous = style.overflow;

    style.overflow = 'hidden';

    return () => {
      style.overflow = previous;
    };
  }, [locked]);
}
