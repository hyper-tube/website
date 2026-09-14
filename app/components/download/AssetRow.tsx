import DownloadIcon from '~icons/material-symbols/download-rounded';
import { useTranslation } from 'react-i18next';

import { ButtonAnchor } from '~/components/ui/ButtonAnchor';
import type { ReleaseAsset } from '~/lib/releases.shared';
import { formatBytes } from '~/lib/format.shared';
import { cn } from '~/lib/styles.shared';

import { Checksum } from './Checksum';

const ROW = cn(
  'flex flex-col gap-3 border-t border-current/15 py-4',
  'first:border-t-0 first:pt-2 last:pb-0',
);

interface AssetRowProps {
  asset: ReleaseAsset;
  emphasized: boolean;
}

export function AssetRow({ asset, emphasized }: AssetRowProps) {
  const { t, i18n } = useTranslation('download');

  const details = [t(`arch.${asset.arch}`), formatBytes(asset.size, i18n.language)].join(' · ');

  return (
    <li className={ROW}>
      <div className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-title-medium">{t(`formats.${asset.format}.name`)}</p>
          <p className="text-body-small text-pretty opacity-80">
            {t(`formats.${asset.format}.hint`)}
          </p>
          <p className="text-label-small whitespace-nowrap opacity-70">{details}</p>
        </div>

        <ButtonAnchor
          href={asset.url}
          variant={emphasized ? 'filled' : 'tonal'}
          aria-label={t('asset.downloadLabel', { file: asset.name })}
        >
          <DownloadIcon aria-hidden />
          <span className="max-sm:hidden">{t('asset.download')}</span>
        </ButtonAnchor>
      </div>

      {asset.sha256 && <Checksum file={asset.name} sha256={asset.sha256} />}
    </li>
  );
}
