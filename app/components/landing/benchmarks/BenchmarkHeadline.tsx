import { useTranslation } from 'react-i18next';

import {
  advantage,
  leadsBenchmark,
  type Benchmark,
  type BenchmarkMetric,
} from '~/lib/benchmarks.shared';
import { AnimatedNumber } from '~/components/ui/AnimatedNumber';
import { formatUnit } from '~/lib/format.shared';
import { cn } from '~/lib/styles.shared';

interface BenchmarkHeadlineProps {
  metric: BenchmarkMetric;
  benchmark: Benchmark;
}

const NUMBER = cn(
  'text-[clamp(4rem,3rem+5vw,7rem)] leading-none font-[650] tracking-[-0.04em]',
  'text-primary tabular-nums',
);

const TIMES = { minimumFractionDigits: 1, maximumFractionDigits: 1 };

export function BenchmarkHeadline({ metric, benchmark }: BenchmarkHeadlineProps) {
  const { t, i18n } = useTranslation('landing');
  const leads = leadsBenchmark(benchmark);

  const times = (value: number) => `${new Intl.NumberFormat(i18n.language, TIMES).format(value)}×`;
  const own = (value: number) =>
    formatUnit(value, benchmark.unit, i18n.language, benchmark.fractionDigits);

  return (
    <div aria-live="polite" className="flex flex-col gap-1">
      <AnimatedNumber
        key={metric}
        from={leads ? 1 : 0}
        value={leads ? advantage(benchmark) : benchmark.values.hypertube}
        format={leads ? times : own}
        className={NUMBER}
      />
      <p className="text-title-large text-on-surface">
        {leads ? t(`benchmarks.headline.${metric}`) : t(`benchmarks.own.${metric}`)}
      </p>
    </div>
  );
}
