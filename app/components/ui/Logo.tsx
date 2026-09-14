import type { SVGProps } from 'react';

import { LOGO_BARS, LOGO_PLAY } from '~/lib/logo.shared';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="none" aria-hidden {...props}>
      <rect width="256" height="256" rx="76" fill="#BFC2FF" />

      <g fill="#11144B">
        {LOGO_BARS.map((bar) => (
          <rect key={bar.x} {...bar} />
        ))}
        <path d={LOGO_PLAY} />
      </g>
    </svg>
  );
}
