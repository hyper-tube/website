import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react';
import CloseIcon from '~icons/material-symbols/close-rounded';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';

import { REDUCED_TRANSITION, TRANSITIONS } from '~/lib/motion.shared';
import { NAVIGATION_LINKS } from '~/lib/navigation.shared';
import { useScrollLock } from '~/hooks/useScrollLock';
import { Button } from '~/components/ui/Button';
import { cn } from '~/lib/styles.shared';

import { GitHubStars } from './GitHubStars';
import { DrawerItem } from './DrawerItem';
import { Brand } from './Brand';

interface NavigationDrawerProps {
  open: boolean;
  onClose: () => void;
}

const scrimVariants = {
  closed: { opacity: 0, transition: TRANSITIONS.exit },
  open: { opacity: 1, transition: TRANSITIONS.enter },
} satisfies Variants;

const panelVariants = {
  closed: { x: '-100%', transition: { duration: 0.3, ease: TRANSITIONS.exit.ease } },
  open: { x: 0, transition: TRANSITIONS.emphasized },
} satisfies Variants;

const reducedPanelVariants = {
  closed: { x: 0, opacity: 0, transition: REDUCED_TRANSITION },
  open: { x: 0, opacity: 1, transition: REDUCED_TRANSITION },
} satisfies Variants;

const PANEL = cn(
  'absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col gap-2 overflow-y-auto',
  'rounded-r-large bg-surface-container-low p-3 text-on-surface shadow-level3',
  'pt-[calc(0.75rem+env(safe-area-inset-top))] pb-[calc(0.75rem+env(safe-area-inset-bottom))]',
);

export function NavigationDrawer({ open, onClose }: NavigationDrawerProps) {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  useScrollLock(open);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="drawer"
          initial="closed"
          animate="open"
          exit="closed"
          className="fixed inset-0 z-50 md:hidden"
        >
          <motion.div
            variants={scrimVariants}
            onClick={onClose}
            className="absolute inset-0 bg-scrim/40"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={t('a11y.navigation')}
            variants={shouldReduceMotion ? reducedPanelVariants : panelVariants}
            className={PANEL}
          >
            <div className="flex items-center justify-between pb-2 pl-3">
              <Brand onNavigate={onClose} />

              <Button variant="standard" icon aria-label={t('a11y.closeMenu')} onClick={onClose}>
                <CloseIcon aria-hidden />
              </Button>
            </div>

            <nav aria-label={t('a11y.navigation')} className="flex flex-col gap-1">
              <DrawerItem path="/" label={t('nav.home')} onNavigate={onClose} />

              {NAVIGATION_LINKS.map((link) => (
                <DrawerItem
                  key={link.path}
                  path={link.path}
                  label={t(link.labelKey)}
                  onNavigate={onClose}
                />
              ))}
            </nav>

            <div className="mt-auto flex px-3 pt-4">
              <GitHubStars />
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
