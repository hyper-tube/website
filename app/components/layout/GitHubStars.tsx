import { Await, useRouteLoaderData } from 'react-router';
import GitHubIcon from '~icons/mdi/github';
import { useTranslation } from 'react-i18next';
import { Suspense } from 'react';

import { ButtonAnchor } from '~/components/ui/ButtonAnchor';
import { githubUrl } from '~/lib/site.shared';
import { cn } from '~/lib/styles.shared';
import { useSite } from '~/hooks/useSite';
import type { loader } from '~/root';

import { StarCount } from './StarCount';

interface GitHubStarsProps {
  className?: string;
}

export function GitHubStars({ className }: GitHubStarsProps) {
  const { t } = useTranslation();
  const { repository } = useSite();

  const stars = useRouteLoaderData<typeof loader>('root')?.stars;

  return (
    <ButtonAnchor
      href={githubUrl(repository)}
      external
      variant="outlined"
      aria-label={t('header.githubLabel', { repository })}
      className={cn('pr-4 pl-3', className)}
    >
      <GitHubIcon aria-hidden />

      <Suspense fallback={<StarCount value={null} />}>
        <Await resolve={stars} errorElement={<StarCount value={null} />}>
          {(value) => <StarCount value={value ?? null} />}
        </Await>
      </Suspense>
    </ButtonAnchor>
  );
}
