import { useEffect, useRef } from 'react';

import { spawnRipple } from '~/lib/ripple';

export function Ripple() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = ref.current;
    const trigger = host?.parentElement;

    if (!host || !trigger) return;

    const onPointerDown = (event: PointerEvent) => spawnRipple(host, trigger, event);

    trigger.addEventListener('pointerdown', onPointerDown);

    return () => trigger.removeEventListener('pointerdown', onPointerDown);
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]"
    />
  );
}
