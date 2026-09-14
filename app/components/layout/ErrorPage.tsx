import SearchOffIcon from '~icons/material-symbols/search-off-rounded';
import ErrorIcon from '~icons/material-symbols/error-outline-rounded';
import { isRouteErrorResponse, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

import { useMotionTransition } from '~/hooks/useMotionTransition';
import { ButtonLink } from '~/components/ui/ButtonLink';
import { Button } from '~/components/ui/Button';
import { TRANSITIONS } from '~/lib/motion.shared';
import { cn } from '~/lib/styles.shared';

interface ErrorPageProps {
  error: unknown;
}

const ROOT = cn(
  'container-page flex min-h-[70svh] flex-1 flex-col items-center justify-center',
  'gap-8 py-20 text-center',
);

const PLATE = 'grid size-28 place-items-center rounded-verylarge bg-primary-container';

const STACK = cn(
  'max-h-64 w-full max-w-3xl overflow-auto rounded-normal bg-surface-container p-4',
  'text-left text-body-small whitespace-pre-wrap text-on-surface-variant',
);

const RISE = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 } };

function resolveStack(error: unknown): string | undefined {
  if (!import.meta.env.DEV || isRouteErrorResponse(error)) return undefined;

  return error instanceof Error ? error.stack : undefined;
}

export function ErrorPage({ error }: ErrorPageProps) {
  const { t } = useTranslation(['errors', 'common']);
  const transition = useMotionTransition(TRANSITIONS.slowSpatial);
  const navigate = useNavigate();

  const isNotFound = isRouteErrorResponse(error) && error.status === 404;
  const Icon = isNotFound ? SearchOffIcon : ErrorIcon;
  const stack = resolveStack(error);

  const stagger = (index: number) => ({
    ...RISE,
    transition: { ...transition, delay: 0.08 * index },
  });

  return (
    <div className={ROOT}>
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={transition}
        className={PLATE}
      >
        <Icon aria-hidden className="size-14 text-on-primary-container" />
      </motion.div>

      <div className="flex max-w-lg flex-col items-center gap-3">
        <motion.h1 {...stagger(1)} className="text-display-medium">
          {isNotFound ? t('errors:notFound.title') : t('errors:default.title')}
        </motion.h1>

        <motion.p {...stagger(2)} className="text-body-large text-on-surface-variant">
          {isNotFound ? t('errors:notFound.description') : t('errors:default.description')}
        </motion.p>
      </div>

      <motion.div {...stagger(3)} className="flex flex-wrap items-center justify-center gap-3">
        <ButtonLink to="/">{t('common:actions.home')}</ButtonLink>

        {isNotFound ? (
          <Button variant="tonal" onClick={() => void navigate(-1)}>
            {t('common:actions.back')}
          </Button>
        ) : (
          <Button variant="tonal" onClick={() => window.location.reload()}>
            {t('common:actions.retry')}
          </Button>
        )}
      </motion.div>

      {stack && (
        <pre className={STACK}>
          <code>{stack}</code>
        </pre>
      )}
    </div>
  );
}
