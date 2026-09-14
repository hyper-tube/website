import OpenInNewIcon from '~icons/material-symbols/open-in-new-rounded';
import RssFeedIcon from '~icons/material-symbols/rss-feed-rounded';
import { useTranslation } from 'react-i18next';

import { ButtonAnchor } from '~/components/ui/ButtonAnchor';
import { githubUrl } from '~/lib/site.shared';
import { useSite } from '~/hooks/useSite';

export function ChangelogHeader() {
  const { t } = useTranslation('changelog');
  const { repository } = useSite();

  return (
    <header className="mx-auto flex w-full max-w-2xl flex-col gap-5">
      <h1 className="text-display-large">{t('header.title')}</h1>
      <p className="text-body-large text-pretty text-on-surface-variant">
        {t('header.description')}
      </p>

      <div className="flex flex-wrap gap-2 pt-1">
        <ButtonAnchor href={githubUrl(repository, 'releases')} external variant="tonal">
          {t('header.github')}
          <OpenInNewIcon aria-hidden />
        </ButtonAnchor>

        <ButtonAnchor href={githubUrl(repository, 'releases.atom')} external variant="text">
          <RssFeedIcon aria-hidden />
          {t('header.feed')}
        </ButtonAnchor>
      </div>
    </header>
  );
}
