import { useTranslation } from 'react-i18next';
import { useId } from 'react';

import type { PlatformDownloads } from '~/lib/releases.shared';
import type { ButtonVariants } from '~/components/ui/button.variants';
import { PlatformIcon } from '~/components/ui/PlatformIcon';
import { tv } from '~/lib/styles.shared';

import { AssetRow } from './AssetRow';

interface PlatformPanelProps {
  group: PlatformDownloads;
  recommended: boolean;
}

const panel = tv({
  base: 'flex h-full flex-col gap-2 rounded-large p-6 sm:p-7',
  variants: {
    recommended: {
      true: 'bg-primary-container text-on-primary-container',
      false: 'bg-surface-container text-on-surface',
    },
  },
});

function downloadVariant(recommended: boolean, index: number): ButtonVariants['variant'] {
  if (!recommended) return 'tonal';

  return index === 0 ? 'filled' : 'tinted';
}

export function PlatformPanel({ group, recommended }: PlatformPanelProps) {
  const { t } = useTranslation('download');
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className={panel({ recommended })}>
      <div className="flex items-start justify-between gap-4">
        <PlatformIcon platform={group.platform} className="size-10" />

        {recommended && (
          <span className="rounded-full bg-primary px-3 py-1 text-label-medium text-on-primary">
            {t('platforms.yourSystem')}
          </span>
        )}
      </div>

      <h2 id={titleId} className="mt-4 text-headline-small">
        {t(`platforms.${group.platform}.name`)}
      </h2>

      <p className="text-body-medium opacity-80">{t(`platforms.${group.platform}.requirements`)}</p>

      {group.assets.length > 0 ? (
        <ul className="mt-4 flex flex-col">
          {group.assets.map((asset, index) => (
            <AssetRow
              key={asset.name}
              asset={asset}
              variant={downloadVariant(recommended, index)}
            />
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-body-medium opacity-80">{t('platforms.unavailable')}</p>
      )}
    </section>
  );
}
