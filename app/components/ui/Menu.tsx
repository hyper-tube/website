import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react';
import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';

import { focusInitialMenuItem, moveMenuFocus } from '~/lib/focus';
import { REDUCED_TRANSITION, TRANSITIONS } from '~/lib/motion.shared';
import { useDismiss } from '~/hooks/useDismiss';
import { cn } from '~/lib/styles.shared';

export interface MenuTriggerProps {
  ref: RefObject<HTMLButtonElement | null>;
  'aria-haspopup': 'menu';
  'aria-expanded': boolean;
  'aria-controls': string;
  onClick: () => void;
}

interface MenuProps {
  label: string;
  trigger: (props: MenuTriggerProps) => ReactNode;
  children: ReactNode;
  className?: string;
}

const PLATE = cn(
  'absolute top-full right-0 z-50 mt-2 min-w-52 origin-top-right p-1.5',
  'rounded-normal bg-surface-container-high text-on-surface shadow-level2',
);

const plateVariants = {
  closed: { opacity: 0, scale: 0.86, y: -6, transition: TRANSITIONS.exit },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...TRANSITIONS.fastSpatial, opacity: TRANSITIONS.effects },
  },
} satisfies Variants;

const reducedPlateVariants = {
  closed: { opacity: 0, scale: 1, y: 0, transition: REDUCED_TRANSITION },
  open: { opacity: 1, scale: 1, y: 0, transition: REDUCED_TRANSITION },
} satisfies Variants;

const DISMISS_ON_TAB = 'Tab';

const MENU_ITEM = '[role^="menuitem"]';

export function Menu({ label, trigger, children, className }: MenuProps) {
  const shouldReduceMotion = useReducedMotion();
  const menuId = useId();

  const [open, setOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const insideRefs = useMemo(() => [triggerRef, plateRef], []);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  const onDismiss = useCallback(
    (reason: 'outside' | 'escape') => close(reason === 'escape'),
    [close],
  );

  useDismiss(open, insideRefs, onDismiss);

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest(MENU_ITEM)) close();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === DISMISS_ON_TAB) {
      close(false);
    } else if (plateRef.current && moveMenuFocus(plateRef.current, event.key)) {
      event.preventDefault();
    }
  };

  return (
    <div className={cn('relative', className)}>
      {trigger({
        ref: triggerRef,
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': menuId,
        onClick: () => setOpen((value) => !value),
      })}

      <AnimatePresence>
        {open && (
          <motion.div
            ref={plateRef}
            id={menuId}
            role="menu"
            aria-label={label}
            initial="closed"
            animate="open"
            exit="closed"
            variants={shouldReduceMotion ? reducedPlateVariants : plateVariants}
            onAnimationStart={() => plateRef.current && focusInitialMenuItem(plateRef.current)}
            onClick={onClick}
            onKeyDown={onKeyDown}
            className={PLATE}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
