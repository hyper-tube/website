import { useTranslation } from 'react-i18next';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';

import {
  BENCHMARK_APPS,
  BENCHMARK_METRICS,
  BENCHMARKS,
  BENCHMARKS_MEASURED,
  type BenchmarkMetric,
} from '~/lib/benchmarks.shared';
import { SegmentedControl } from '~/components/ui/SegmentedControl';
import { formatDate } from '~/lib/format.shared';
import { cn } from '~/lib/styles.shared';

import { BenchmarkHeadline } from './BenchmarkHeadline';
import { BenchmarkBar } from './BenchmarkBar';

const PANEL = 'flex flex-col gap-10 rounded-verylarge bg-surface-container-low p-6 sm:p-10';

const NOTES = cn(
  'flex flex-col gap-2 border-t border-outline-variant pt-6',
  'text-body-small text-on-surface-variant',
);

export function BenchmarkPanel() {
  const { t, i18n } = useTranslation('landing');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const [metric, setMetric] = useState<BenchmarkMetric>('memory');
  const benchmark = BENCHMARKS[metric];

  const items = BENCHMARK_METRICS.map((id) => ({ id, label: t(`benchmarks.metrics.${id}`) }));

  return (
    <div ref={ref} className={PANEL}>
      <SegmentedControl
        items={items}
        value={metric}
        onChange={setMetric}
        label={t('benchmarks.label')}
        className="self-start max-sm:w-full"
      />

      <BenchmarkHeadline metric={metric} benchmark={benchmark} />

      <ul className="flex flex-col gap-6">
        {BENCHMARK_APPS.map((app) => (
          <BenchmarkBar
            key={app}
            app={app}
            metric={metric}
            benchmark={benchmark}
            visible={inView}
          />
        ))}
      </ul>

      <div className={NOTES}>
        <p>
          <span className="text-label-medium text-on-surface">{t('benchmarks.lowerIsBetter')}</span>
          {' · '}
          {t(`benchmarks.explain.${metric}`)}
        </p>
        <p>{t('benchmarks.measured', { date: formatDate(BENCHMARKS_MEASURED, i18n.language) })}</p>
      </div>
    </div>
  );
}
