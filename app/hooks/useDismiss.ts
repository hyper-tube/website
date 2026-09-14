import { useEffect, type RefObject } from 'react';

export function useDismiss(
  open: boolean,
  refs: readonly RefObject<HTMLElement | null>[],
  onDismiss: (reason: 'outside' | 'escape') => void,
): void {
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const inside = refs.some((ref) => ref.current?.contains(event.target as Node));
      if (!inside) onDismiss('outside');
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss('escape');
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, refs, onDismiss]);
}
