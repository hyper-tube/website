import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';

import type { ReleaseNotes } from '~/lib/releases.shared';
import { cn } from '~/lib/styles.shared';

import { ChangelogVersion } from './ChangelogVersion';

interface ChangelogTimelineProps {
  releases: readonly ReleaseNotes[];
  latestVersion: string | null;
}

const SPRING = { damping: 30, restDelta: 0.001 };

const LINE = cn(
  'absolute inset-y-3 left-32 -ml-[8.5px] hidden w-px overflow-hidden',
  'bg-outline-variant lg:block',
);

export function ChangelogTimeline({ releases, latestVersion }: ChangelogTimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] });
  const spring = useSpring(scrollYProgress, SPRING);
  const height = useTransform(
    shouldReduceMotion ? scrollYProgress : spring,
    (value) => `${value * 100}%`,
  );

  return (
    <div ref={ref} className="relative">
      <div aria-hidden className={LINE}>
        <motion.div
          style={{ height }}
          className="absolute inset-x-0 top-0 bg-primary will-change-[height]"
        />
      </div>

      <div className="flex flex-col gap-y-12 sm:gap-y-16 lg:gap-y-20">
        {releases.map((release) => (
          <ChangelogVersion
            key={release.version}
            release={release}
            latest={release.version === latestVersion}
          />
        ))}
      </div>
    </div>
  );
}
