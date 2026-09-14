import { LOGO_BARS, LOGO_PLAY } from '~/lib/logo.shared';
import { cn } from '~/lib/styles.shared';

const MARK = cn(
  'pointer-events-none absolute -right-24 -bottom-32 -z-10 size-[34rem] rotate-[-14deg]',
  'text-on-primary-container opacity-[0.06]',
);

export function BandMark() {
  return (
    <svg viewBox="0 0 256 256" aria-hidden className={MARK}>
      <rect width="256" height="256" rx="76" fill="none" stroke="currentColor" strokeWidth="10" />

      <g fill="currentColor">
        {LOGO_BARS.map((bar) => (
          <rect key={bar.x} {...bar} />
        ))}
        <path d={LOGO_PLAY} />
      </g>
    </svg>
  );
}
