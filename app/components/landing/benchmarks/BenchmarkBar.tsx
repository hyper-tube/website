import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import {
  barFraction,
  type Benchmark,
  type BenchmarkApp,
  type BenchmarkMetric,
} from '~/lib/benchmarks.shared';
import { useMotionTransition } from '~/hooks/useMotionTransition';
import { AnimatedNumber } from '~/components/ui/AnimatedNumber';
import { formatUnit } from '~/lib/format.shared';
import { TRANSITIONS } from '~/lib/motion.shared';
import { tv } from '~/lib/styles.shared';

interface BenchmarkBarProps {
  app: BenchmarkApp;
  metric: BenchmarkMetric;
  benchmark: Benchmark;
  visible: boolean;
}

const bar = tv({
  slots: {
    label: 'text-title-medium',
    stack: 'text-body-small text-on-surface-variant',
    value: 'shrink-0 text-title-medium whitespace-nowrap tabular-nums',
    missing: 'text-right text-body-small text-on-surface-variant',
    fill: 'absolute inset-y-0 left-0 rounded-full',
  },
  variants: {
    highlighted: {
      true: { label: 'text-on-surface', value: 'text-primary', fill: 'bg-primary' },
      false: {
        label: 'text-on-surface-variant',
        value: 'text-on-surface-variant',
        fill: 'bg-outline',
      },
    },
  },
});

export function BenchmarkBar({ app, metric, benchmark, visible }: BenchmarkBarProps) {
  const { t, i18n } = useTranslation('landing');
  const transition = useMotionTransition(TRANSITIONS.slowSpatial);

  const value = benchmark.values[app];
  const styles = bar({ highlighted: app === 'hypertube' });
  const fraction = visible && value !== undefined ? barFraction(benchmark, value) : 0;
  const shown = visible && value !== undefined;

  const format = (value: number) =>
    formatUnit(value, benchmark.unit, i18n.language, benchmark.fractionDigits);

  return (
    <li className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-4">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className={styles.label()}>{t(`benchmarks.apps.${app}`)}</span>
          <span className={styles.stack()}>{t(`benchmarks.stacks.${app}`)}</span>
        </span>
        {value === undefined ? (
          <span className={styles.missing()}>{t('benchmarks.unavailable')}</span>
        ) : (
          <AnimatedNumber
            key={metric}
            from={0}
            value={visible ? value : 0}
            format={format}
            className={styles.value()}
          />
        )}
      </div>

      <div className="relative h-3 overflow-hidden rounded-full bg-surface-container-highest">
        <motion.div
          initial={false}
          animate={{ width: `${Math.max(fraction * 100, shown ? 2 : 0)}%` }}
          transition={transition}
          className={styles.fill()}
        />
      </div>
    </li>
  );
}
