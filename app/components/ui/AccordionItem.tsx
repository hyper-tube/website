import ExpandMoreIcon from '~icons/material-symbols/expand-more-rounded';
import { useId, type ReactNode } from 'react';

import { cn, tv } from '~/lib/styles.shared';

import { Ripple } from './Ripple';

interface AccordionItemProps {
  id?: string;
  title: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  headingLevel?: 'h2' | 'h3';
}

const item = tv({
  slots: {
    root: 'scroll-mt-28 border-b border-outline-variant last:border-b-0',
    trigger: [
      'state-layer -mx-3 flex w-[calc(100%+1.5rem)] items-center gap-4 rounded-normal px-3 py-5',
      'text-left text-title-large transition-colors duration-200 ease-effects',
    ],
    glyph: [
      'grid size-10 shrink-0 place-items-center rounded-full',
      'transition-[background-color,color,rotate] duration-500 ease-expressive',
    ],
    region: 'grid transition-[grid-template-rows] duration-500 ease-emphasized',
    content: [
      'text-body-large text-pretty text-on-surface-variant',
      'transition-[opacity,translate] duration-400 ease-emphasized-decel',
    ],
  },
  variants: {
    open: {
      true: {
        trigger: 'text-primary',
        glyph: 'rotate-180 bg-primary text-on-primary',
        region: 'grid-rows-[1fr]',
        content: 'translate-y-0 opacity-100 delay-75',
      },
      false: {
        trigger: 'text-on-surface',
        glyph: 'bg-surface-container-high text-on-surface-variant',
        region: 'grid-rows-[0fr]',
        content: '-translate-y-2 opacity-0',
      },
    },
  },
});

export function AccordionItem({
  id,
  title,
  open,
  onToggle,
  children,
  headingLevel: Heading = 'h3',
}: AccordionItemProps) {
  const generatedId = useId();
  const triggerId = `${generatedId}-trigger`;
  const regionId = `${generatedId}-region`;

  const styles = item({ open });

  return (
    <div id={id} className={styles.root()}>
      <Heading className="m-0">
        <button
          id={triggerId}
          type="button"
          aria-expanded={open}
          aria-controls={regionId}
          onClick={onToggle}
          className={styles.trigger()}
        >
          <Ripple />
          <span className="flex-1">{title}</span>

          <span aria-hidden className={styles.glyph()}>
            <ExpandMoreIcon className="size-6" />
          </span>
        </button>
      </Heading>

      <div
        id={regionId}
        role="region"
        aria-labelledby={triggerId}
        inert={!open}
        className={styles.region()}
      >
        <div className="min-h-0 overflow-hidden">
          <div className={cn(styles.content(), 'pr-14 pb-6')}>{children}</div>
        </div>
      </div>
    </div>
  );
}
