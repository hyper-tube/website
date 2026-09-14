import { LayoutGroup, motion } from 'motion/react';
import { useRef, type KeyboardEvent, type ReactNode } from 'react';

import { nextHorizontalIndex } from '~/lib/focus';
import { TRANSITIONS } from '~/lib/motion.shared';
import { cn, tv } from '~/lib/styles.shared';

import { Ripple } from './Ripple';

export interface TabItem<T extends string> {
  readonly id: T;
  readonly label: ReactNode;
}

interface TabsProps<T extends string> {
  items: readonly TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  idPrefix: string;
  label: string;
  className?: string;
}

const tab = tv({
  base: [
    'state-layer relative flex h-12 shrink-0 items-center justify-center gap-2 px-4',
    'text-title-small transition-colors duration-200 ease-effects',
  ],
  variants: {
    selected: {
      true: 'text-primary',
      false: 'text-on-surface-variant hover:text-on-surface',
    },
  },
});

export const tabId = (prefix: string, id: string) => `${prefix}-tab-${id}`;
export const panelId = (prefix: string, id: string) => `${prefix}-panel-${id}`;

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  idPrefix,
  label,
  className,
}: TabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = items.findIndex((item) => item.id === value);
    const nextIndex = nextHorizontalIndex(event.key, index, items.length);
    if (nextIndex === null) return;

    event.preventDefault();

    const next = items[nextIndex];

    onChange(next.id);
    listRef.current?.querySelector<HTMLElement>(`#${tabId(idPrefix, next.id)}`)?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn('flex overflow-x-auto border-b border-outline-variant', className)}
    >
      <LayoutGroup id={idPrefix}>
        {items.map((item) => {
          const selected = item.id === value;

          return (
            <button
              key={item.id}
              id={tabId(idPrefix, item.id)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId(idPrefix, item.id)}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(item.id)}
              className={tab({ selected })}
            >
              <Ripple />
              {item.label}

              {selected && (
                <motion.span
                  layoutId="indicator"
                  transition={TRANSITIONS.spatial}
                  className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-primary"
                />
              )}
            </button>
          );
        })}
      </LayoutGroup>
    </div>
  );
}
