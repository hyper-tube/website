const GROW_DURATION = 450;
const FADE_DURATION = 300;
const MIN_VISIBLE = 160;

const GROW_EASING = 'cubic-bezier(0.2, 0, 0, 1)';
const RIPPLE_OPACITY = 0.13;

const RELEASE_EVENTS = ['pointerup', 'pointercancel', 'pointerleave'] as const;

export function spawnRipple(host: HTMLElement, trigger: HTMLElement, event: PointerEvent): void {
  if (event.button !== 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const bounds = host.getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;
  const radius = Math.hypot(Math.max(x, bounds.width - x), Math.max(y, bounds.height - y));

  const ripple = document.createElement('span');
  ripple.className = 'ripple';

  Object.assign(ripple.style, {
    left: `${x - radius}px`,
    top: `${y - radius}px`,
    width: `${radius * 2}px`,
    height: `${radius * 2}px`,
  });

  host.append(ripple);

  const startedAt = performance.now();

  ripple.animate(
    [
      { transform: 'scale(0)', opacity: RIPPLE_OPACITY },
      { transform: 'scale(1)', opacity: RIPPLE_OPACITY },
    ],
    { duration: GROW_DURATION, easing: GROW_EASING, fill: 'forwards' },
  );

  const release = () => {
    RELEASE_EVENTS.forEach((type) => trigger.removeEventListener(type, release));

    const delay = Math.max(0, MIN_VISIBLE - (performance.now() - startedAt));

    ripple
      .animate([{ opacity: RIPPLE_OPACITY }, { opacity: 0 }], {
        duration: FADE_DURATION,
        delay,
        easing: 'linear',
        fill: 'forwards',
      })
      .finished.then(() => ripple.remove())
      .catch(() => ripple.remove());
  };

  RELEASE_EVENTS.forEach((type) => trigger.addEventListener(type, release));
}
