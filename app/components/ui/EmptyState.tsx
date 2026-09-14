import type { ComponentType, ReactNode, SVGProps } from 'react';
import { motion } from 'motion/react';

import { useMotionTransition } from '~/hooks/useMotionTransition';
import { TRANSITIONS } from '~/lib/motion.shared';
import { cn } from '~/lib/styles.shared';

interface EmptyStateProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  children?: ReactNode;
}

const ROOT = cn(
  'container-page flex min-h-[60svh] flex-col items-center justify-center',
  'gap-6 py-20 text-center',
);

const RISE = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export function EmptyState({ icon: Icon, title, description, children }: EmptyStateProps) {
  const transition = useMotionTransition(TRANSITIONS.slowSpatial);

  const stagger = (index: number) => ({
    ...RISE,
    transition: { ...transition, delay: 0.1 * index },
  });

  return (
    <div className={ROOT}>
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={transition}
        className="grid size-24 place-items-center rounded-verylarge bg-secondary-container"
      >
        <Icon aria-hidden className="size-12 text-on-secondary-container" />
      </motion.div>

      <div className="flex max-w-md flex-col gap-2">
        <motion.h1 {...stagger(1)} className="text-headline-large">
          {title}
        </motion.h1>

        <motion.p {...stagger(2)} className="text-body-large text-on-surface-variant">
          {description}
        </motion.p>
      </div>

      {children && <motion.div {...stagger(3)}>{children}</motion.div>}
    </div>
  );
}
