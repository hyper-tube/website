import { tv } from '~/lib/styles.shared';

interface ChartLabelProps {
  label: string;
  title: string;
  tone?: 'primary' | 'tertiary';
  align?: 'start' | 'end';
}

const chartLabel = tv({
  slots: {
    root: 'flex min-w-0 flex-col',
    label: 'text-label-medium',
    title: 'truncate text-body-small text-on-surface-variant',
  },
  variants: {
    tone: {
      primary: { label: 'text-primary' },
      tertiary: { label: 'text-tertiary' },
    },
    align: {
      start: { root: 'items-start text-left' },
      end: { root: 'items-end text-right' },
    },
  },
  defaultVariants: {
    tone: 'primary',
    align: 'start',
  },
});

export function ChartLabel({ label, title, tone, align }: ChartLabelProps) {
  const styles = chartLabel({ tone, align });

  return (
    <div className={styles.root()}>
      <span className={styles.label()}>{label}</span>
      <span className={styles.title()}>{title}</span>
    </div>
  );
}
