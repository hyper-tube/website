export const BENCHMARK_METRICS = ['memory', 'cpu', 'startup'] as const;

export type BenchmarkMetric = (typeof BENCHMARK_METRICS)[number];

export const BENCHMARK_APPS = ['hypertube', 'limusic', 'ytubic', 'pear', 'chrome'] as const;

export type BenchmarkApp = (typeof BENCHMARK_APPS)[number];

type Competitor = Exclude<BenchmarkApp, 'hypertube'>;

export interface Benchmark {
  readonly unit: 'megabyte' | 'percent' | 'second';
  readonly fractionDigits: number;
  readonly values: { readonly hypertube: number } & Partial<Record<Competitor, number>>;
}

export const BENCHMARKS_MEASURED = '2026-09-14';

const LEAD = 1.05;

export const BENCHMARKS: Record<BenchmarkMetric, Benchmark> = {
  memory: {
    unit: 'megabyte',
    fractionDigits: 0,
    values: { hypertube: 397, limusic: 492.5, pear: 653.4, chrome: 676.7 },
  },
  cpu: {
    unit: 'percent',
    fractionDigits: 1,
    values: { hypertube: 1.32, limusic: 3.08, pear: 2.76, chrome: 2.85 },
  },
  startup: {
    unit: 'second',
    fractionDigits: 1,
    values: { hypertube: 1.63, limusic: 1.23, ytubic: 0.98, pear: 2.25, chrome: 1.46 },
  },
};

const competitorValues = (benchmark: Benchmark) =>
  BENCHMARK_APPS.flatMap((app) => {
    const value = benchmark.values[app];

    return app === 'hypertube' || value === undefined ? [] : [value];
  });

export function advantage(benchmark: Benchmark): number {
  return Math.min(...competitorValues(benchmark)) / benchmark.values.hypertube;
}

export function leadsBenchmark(benchmark: Benchmark): boolean {
  return advantage(benchmark) >= LEAD;
}

export function barFraction(benchmark: Benchmark, value: number): number {
  return value / Math.max(benchmark.values.hypertube, ...competitorValues(benchmark));
}
