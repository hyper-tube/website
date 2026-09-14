import { useTranslation } from 'react-i18next';

import type { ReleaseAsset } from '~/lib/releases.shared';
import { INSTALL_STEPS } from '~/lib/install.shared';
import { cn } from '~/lib/styles.shared';

import { CommandBlock } from './CommandBlock';

interface InstallStepsProps {
  asset: ReleaseAsset;
}

const NUMBER = cn(
  'grid size-8 shrink-0 place-items-center rounded-full',
  'bg-secondary-container text-label-large text-on-secondary-container',
);

export function InstallSteps({ asset }: InstallStepsProps) {
  const { t } = useTranslation('download');

  return (
    <ol className="flex flex-col gap-6">
      {INSTALL_STEPS[asset.format].map((step, index) => (
        <li key={step.labelKey} className="flex gap-4">
          <span aria-hidden className={NUMBER}>
            {index + 1}
          </span>

          <div className="flex min-w-0 flex-1 flex-col gap-3 pt-1">
            <p className="text-body-large text-pretty">{t(step.labelKey)}</p>

            {step.command && <CommandBlock command={step.command(asset.name)} />}
          </div>
        </li>
      ))}
    </ol>
  );
}
