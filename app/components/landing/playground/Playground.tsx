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
    <section ref={ref} className="container-page flex flex-col gap-10 section-spacing md:gap-14">
      <SectionIntro
        eyebrow={t('playground.eyebrow')}
        title={t('playground.title')}
        description={t('playground.description')}
      />

      <DemoPlayerProvider active={inView && pageVisible}>
        <div className={LAYOUT}>
          <FeatureList value={feature} onChange={pickFeature} />
          <DemoWindow
            ref={windowRef}
            feature={feature}
            onFeatureChange={setFeature}
            className="max-lg:order-first max-lg:scroll-mt-24 lg:sticky lg:top-28"
          />
        </div>
      </DemoPlayerProvider>
    </section>
  );
}
