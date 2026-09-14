import { LayoutGroup, motion } from 'motion/react';
import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';

import { nextHorizontalIndex } from '~/lib/focus';
import { TRANSITIONS } from '~/lib/motion.shared';
import { cn, tv } from '~/lib/styles.shared';

import { Ripple } from './Ripple';

export interface SegmentedItem<T extends string> {
  readonly id: T;
  readonly label: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  items: readonly SegmentedItem<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  size?: 'sm' | 'md';
  className?: string;
}

const segment = tv({
  base: [
    'state-layer relative flex flex-1 items-center justify-center gap-1.5 rounded-full px-4',
    'whitespace-nowrap transition-colors duration-200 ease-effects',
  ],
  variants: {
    selected: {
      true: 'text-on-secondary-container',
      false: 'text-on-surface-variant hover:text-on-surface',
    },
    size: {
      sm: 'h-8 text-label-medium',
      md: 'h-10 text-label-large',
    },
  },
});

export function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  label,
  size = 'md',
  className,
}: SegmentedControlProps<T>) {
  const groupId = useId();
  const ref = useRef<HTMLDivElement>(null);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = items.findIndex((item) => item.id === value);
    const next = nextHorizontalIndex(event.key, index, items.length);
    if (next === null) return;

    event.preventDefault();
    onChange(items[next].id);
    ref.current?.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus();
  };

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn('inline-flex rounded-full bg-surface-container-high p-1', className)}
    >
      <LayoutGroup id={groupId}>
        {items.map((item) => {
          const selected = item.id === value;

          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(item.id)}
              className={segment({ selected, size })}
            >
              {selected && (
                <motion.span
                  layoutId="segment"
                  transition={TRANSITIONS.spatial}
                  className="absolute inset-0 -z-10 rounded-full bg-secondary-container"
                />
              )}

              <Ripple />
              {item.label}
            </button>
          );
        })}
      </LayoutGroup>
    </div>
  );
}
