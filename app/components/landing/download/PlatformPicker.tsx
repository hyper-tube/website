import { LayoutGroup, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useRef, type KeyboardEvent } from 'react';

import { PLATFORMS, type PlatformId } from '~/lib/platforms.shared';
import { PlatformIcon } from '~/components/ui/PlatformIcon';
import { nextHorizontalIndex } from '~/lib/focus';
import { TRANSITIONS } from '~/lib/motion.shared';
import { Ripple } from '~/components/ui/Ripple';
import { tv } from '~/lib/styles.shared';

interface PlatformPickerProps {
  value: PlatformId;
  onChange: (platform: PlatformId) => void;
}

const option = tv({
  base: [
    'state-layer relative flex h-24 w-24 flex-col items-center justify-center gap-2 sm:w-28',
    'rounded-large text-label-large transition-[border-radius,color] duration-350',
    'ease-expressive-fast active:rounded-normal',
  ],
  variants: {
    selected: {
      true: 'rounded-verylarge text-on-primary',
      false: 'text-on-primary-container',
    },
  },
});

const RESTING = 'absolute inset-0 -z-20 rounded-[inherit] bg-on-primary-container/8';

export function PlatformPicker({ value, onChange }: PlatformPickerProps) {
  const { t } = useTranslation(['landing', 'download']);
  const ref = useRef<HTMLDivElement>(null);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = nextHorizontalIndex(event.key, PLATFORMS.indexOf(value), PLATFORMS.length);
    if (next === null) return;

    event.preventDefault();
    onChange(PLATFORMS[next]);
    ref.current?.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus();
  };

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={t('landing:download.label')}
      onKeyDown={onKeyDown}
      className="flex gap-2"
    >
      <LayoutGroup id="band-platforms">
        {PLATFORMS.map((platform) => {
          const selected = platform === value;

          return (
            <button
              key={platform}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(platform)}
              className={option({ selected })}
            >
              {selected && (
                <motion.span
                  layoutId="band-platform"
                  transition={TRANSITIONS.spatial}
                  className="absolute inset-0 -z-10 rounded-[inherit] bg-primary"
                />
              )}

              <span className={RESTING} />
              <Ripple />
              <PlatformIcon platform={platform} className="size-8" />
              {t(`download:platforms.${platform}.name`)}
            </button>
          );
        })}
      </LayoutGroup>
    </div>
  );
}
