import { useInView } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';

import { SectionIntro } from '~/components/landing/shared/SectionIntro';
import type { PlaygroundFeature } from '~/lib/playground.shared';
import { DemoPlayerProvider } from '~/providers/demo-player';
import { DemoWindow } from '~/components/demo/DemoWindow';
import { usePageVisible } from '~/hooks/usePageVisible';
import { revealOnSmallScreens } from '~/lib/scroll';
import { cn } from '~/lib/styles.shared';

import { FeatureList } from './FeatureList';

const LAYOUT = cn(
  'grid items-start gap-10',
  'lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16',
);

export function Playground() {
  const { t } = useTranslation('landing');
  const pageVisible = usePageVisible();

  const ref = useRef<HTMLElement>(null);
  const windowRef = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.2 });

  const [feature, setFeature] = useState<PlaygroundFeature>('colors');

  const pickFeature = (next: PlaygroundFeature) => {
    setFeature(next);
    revealOnSmallScreens(windowRef.current);
  };

  return (
    <section ref={ref} className="container-page flex flex-col gap-14 py-24 md:py-32">
      <SectionIntro
        eyebrow={t('playground.eyebrow')}
        title={t('playground.title')}
        description={t('playground.description')}
      />

      <DemoPlayerProvider active={inView && pageVisible}>
        <div className={LAYOUT}>
          <FeatureList value={feature} onChange={pickFeature} />
          <div className="flex flex-col gap-3 max-lg:order-first lg:sticky lg:top-28">
            <DemoWindow
              ref={windowRef}
              feature={feature}
              onFeatureChange={setFeature}
              className="max-lg:scroll-mt-24"
            />
            <p className="px-2 text-body-small text-on-surface-variant">
              {t('playground.credits')}
            </p>
          </div>
        </div>
      </DemoPlayerProvider>
    </section>
  );
}
