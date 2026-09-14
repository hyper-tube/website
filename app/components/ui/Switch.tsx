import CheckIcon from '~icons/material-symbols/check-rounded';

import { cn, tv } from '~/lib/styles.shared';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

const track = tv({
  slots: {
    root: [
      'relative inline-flex h-8 w-13 shrink-0 items-center rounded-full border-2',
      'transition-colors duration-200 ease-effects disabled:opacity-40',
    ],
    thumb: [
      'grid place-items-center rounded-full transition-[translate,width,height,background-color]',
      'duration-350 ease-expressive-fast',
    ],
  },
  variants: {
    checked: {
      true: {
        root: 'border-primary bg-primary',
        thumb: 'size-6 translate-x-[1.375rem] bg-on-primary text-primary',
      },
      false: {
        root: 'border-outline bg-surface-container-highest',
        thumb: 'size-4 translate-x-1.5 bg-outline text-transparent',
      },
    },
  },
});

export function Switch({ checked, onChange, label, disabled, className }: SwitchProps) {
  const styles = track({ checked });

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(styles.root(), className)}
    >
      <span className={styles.thumb()}>
        <CheckIcon aria-hidden className="size-4" />
      </span>
    </button>
  );
}
