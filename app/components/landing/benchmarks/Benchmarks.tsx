import { useTranslation } from 'react-i18next';

import { SectionIntro } from '~/components/landing/shared/SectionIntro';
import { cn } from '~/lib/styles.shared';

import { BenchmarkPanel } from './BenchmarkPanel';

const SECTION = cn(
  'container-page section-spacing grid gap-10 md:gap-12',
  'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-20',
);

export function Benchmarks() {
  const { t } = useTranslation('landing');

  return (
    <section className={SECTION}>
      <SectionIntro
        eyebrow={t('benchmarks.eyebrow')}
        title={t('benchmarks.title')}
        description={t('benchmarks.description')}
        className="lg:sticky lg:top-32 lg:self-start"
      />

      <BenchmarkPanel />
    </section>
  );
}
