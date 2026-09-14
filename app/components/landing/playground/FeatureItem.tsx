import { motion } from 'motion/react';

import { TRANSITIONS } from '~/lib/motion.shared';
import { tv } from '~/lib/styles.shared';

interface FeatureItemProps {
  index: number;
  title: string;
  description: string;
  active: boolean;
  onSelect: () => void;
}

const item = tv({
  slots: {
    button: 'group relative flex w-full gap-5 py-5 pl-6 text-left',
    number: 'pt-1 text-title-medium tabular-nums transition-colors duration-200 ease-effects',
    title: 'text-headline-small transition-colors duration-200 ease-effects',
    region: 'grid transition-[grid-template-rows] duration-500 ease-emphasized',
    description: [
      'block pt-2 text-body-large text-pretty text-on-surface-variant',
      'transition-[opacity,translate] duration-400 ease-emphasized-decel',
    ],
  },
  variants: {
    active: {
      true: {
        number: 'text-primary',
        title: 'text-on-surface',
        region: 'grid-rows-[1fr]',
        description: 'translate-y-0 opacity-100 delay-100',
      },
      false: {
        number: 'text-on-surface-variant/70',
        title: 'text-on-surface-variant group-hover:text-on-surface',
        region: 'grid-rows-[0fr]',
        description: '-translate-y-1 opacity-0',
      },
    },
  },
});

export function FeatureItem({ index, title, description, active, onSelect }: FeatureItemProps) {
  const styles = item({ active });

  return (
    <li className="relative border-b border-outline-variant last:border-b-0">
      <span
        aria-hidden
        className="absolute inset-y-4 left-0 w-1 rounded-full bg-surface-container-highest"
      />

      {active && (
        <motion.span
          layoutId="feature-indicator"
          transition={TRANSITIONS.spatial}
          className="absolute inset-y-4 left-0 z-10 w-1 rounded-full bg-primary"
        />
      )}

      <button type="button" aria-pressed={active} onClick={onSelect} className={styles.button()}>
        <span aria-hidden className={styles.number()}>
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className="flex min-w-0 flex-col">
          <span className={styles.title()}>{title}</span>

          <span className={styles.region()}>
            <span className="block min-h-0 overflow-hidden">
              <span className={styles.description()}>{description}</span>
            </span>
          </span>
        </span>
      </button>
    </li>
  );
}
