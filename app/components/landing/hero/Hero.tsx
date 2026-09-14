import { useTranslation } from 'react-i18next';

import { ScreenTour } from '~/components/landing/tour/ScreenTour';
import type { ReleaseDownloads } from '~/lib/releases.shared';
import type { PlatformId } from '~/lib/platforms.shared';
import { cn } from '~/lib/styles.shared';

import { ReleaseLink } from './ReleaseLink';
import { HeroActions } from './HeroActions';
import { HeroTitle } from './HeroTitle';

const INTRO = cn(
  'grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]',
  'lg:items-end lg:gap-16',
);

interface HeroProps {
  release: ReleaseDownloads | null;
  platform: PlatformId | null;
}

export function Hero({ release, platform }: HeroProps) {
  const { t } = useTranslation('landing');

  return (
    <section className="container-page flex flex-col gap-14 pt-8 md:gap-20 md:pt-16">
      <div className={INTRO}>
        <div className="flex flex-col items-start gap-8">
          {release && <ReleaseLink version={release.version} />}
          <HeroTitle />
        </div>

        <div className="flex flex-col gap-7 lg:pb-2">
          <p className="text-title-large font-[450] text-pretty text-on-surface-variant">
            {t('hero.subtitle')}
          </p>

          <HeroActions release={release} platform={platform} />
        </div>
      </div>

      <ScreenTour />
    </section>
  );
}
