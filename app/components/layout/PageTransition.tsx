import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react';
import { UNSAFE_DataRouterStateContext, useLocation, useNavigation, useOutlet } from 'react-router';
import { useContext, useState, useSyncExternalStore, type PropsWithChildren } from 'react';
import type { Variants } from 'motion';

import { REDUCED_TRANSITION, TRANSITIONS } from '~/lib/motion.shared';

const exitTarget = () => ({
  opacity: 0,
  position: 'absolute' as const,
  left: 0,
  right: 0,
  zIndex: 0,
  y: -window.scrollY,
});

const PENDING_DELAY = 0.12;

const pageVariants = {
  initial: { opacity: 0, y: 24, scale: 0.985 },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...TRANSITIONS.emphasized,
      opacity: { ...TRANSITIONS.enter, delay: 0.05 },
    },
  },
  revealed: { opacity: 1, y: 0, scale: 1, transition: TRANSITIONS.effects },
  pending: {
    opacity: 0.6,
    y: 0,
    scale: 1,
    transition: { ...TRANSITIONS.effects, delay: PENDING_DELAY },
  },
  exit: () => ({
    ...exitTarget(),
    transition: { opacity: TRANSITIONS.exit, y: { duration: 0 } },
  }),
} satisfies Variants;

const reducedPageVariants = {
  initial: { opacity: 0, y: 0, scale: 1 },
  enter: { opacity: 1, y: 0, scale: 1, transition: REDUCED_TRANSITION },
  revealed: { opacity: 1, y: 0, scale: 1, transition: REDUCED_TRANSITION },
  pending: {
    opacity: 0.6,
    y: 0,
    scale: 1,
    transition: { ...REDUCED_TRANSITION, delay: PENDING_DELAY },
  },
  exit: () => ({
    ...exitTarget(),
    transition: { opacity: REDUCED_TRANSITION, y: { duration: 0 } },
  }),
} satisfies Variants;

const neverChanges = () => () => {};
const hydrated = () => false;
const rendering = () => true;

function useIsHydrating() {
  return useSyncExternalStore(neverChanges, hydrated, rendering);
}

function FrozenRouter({ children }: PropsWithChildren) {
  const state = useContext(UNSAFE_DataRouterStateContext);
  const isPresent = useIsPresent();

  const [presentState, setPresentState] = useState(state);
  if (isPresent && presentState !== state) setPresentState(state);

  return (
    <UNSAFE_DataRouterStateContext.Provider value={isPresent ? state : presentState}>
      {children}
    </UNSAFE_DataRouterStateContext.Provider>
  );
}

function Page({
  variants,
  skipReveal,
  isPending,
  children,
}: PropsWithChildren<{ variants: Variants; skipReveal: boolean; isPending: boolean }>) {
  const [isRevealed, setIsRevealed] = useState(skipReveal);

  return (
    <motion.div
      variants={variants}
      initial={skipReveal ? 'revealed' : 'initial'}
      animate={isPending ? 'pending' : isRevealed ? 'revealed' : 'enter'}
      exit="exit"
      onAnimationComplete={(definition) => {
        if (definition === 'enter') setIsRevealed(true);
      }}
      className="relative z-10 flex min-h-full origin-top flex-col bg-background"
    >
      <FrozenRouter>{children}</FrozenRouter>
    </motion.div>
  );
}

export function PageTransition() {
  const shouldReduceMotion = useReducedMotion();
  const isHydrating = useIsHydrating();
  const navigation = useNavigation();
  const { pathname } = useLocation();
  const outlet = useOutlet();

  const isPending = navigation.state === 'loading' && navigation.location.pathname !== pathname;

  return (
    <AnimatePresence>
      <Page
        key={pathname}
        skipReveal={isHydrating}
        isPending={isPending}
        variants={shouldReduceMotion ? reducedPageVariants : pageVariants}
      >
        {outlet}
      </Page>
    </AnimatePresence>
  );
}
