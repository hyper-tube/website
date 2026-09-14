import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import { PLATFORMS, type PlatformId } from '~/lib/platforms.shared';
import type { ReleaseDownloads } from '~/lib/releases.shared';
import { formatDate } from '~/lib/format.shared';
import { cn } from '~/lib/styles.shared';

import { DownloadBandAction } from './DownloadBandAction';
import { PlatformPicker } from './PlatformPicker';
import { BandMark } from './BandMark';

interface DownloadBandProps {
  release: ReleaseDownloads | null;
  platform: PlatformId | null;
}

const BAND = cn(
  'relative isolate grid gap-10 overflow-hidden rounded-huge px-6 py-14 sm:px-12 md:py-20',
  'bg-primary-container text-on-primary-container lg:grid-cols-2 lg:items-center lg:px-16',
);

export function DownloadBand({ release, platform }: DownloadBandProps) {
  const { t, i18n } = useTranslation('landing');
  const [selected, setSelected] = useState<PlatformId>(platform ?? PLATFORMS[0]);

  if (!release) return null;

  return (
    <section className="container-page py-12 md:py-20">
      <div className={BAND}>
        <BandMark />

        <div className="flex flex-col gap-5">
          <h2 className="text-display-large text-balance">{t('download.title')}</h2>
          <p className="max-w-md text-body-large text-pretty opacity-85">
            {t('download.description')}
          </p>
          <p className="text-label-large opacity-75">
            {t('download.version', {
              version: release.version,
              date: formatDate(release.publishedAt, i18n.language),
            })}
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:items-end">
          <PlatformPicker value={selected} onChange={setSelected} />
          <DownloadBandAction assets={release.assets} platform={selected} />
        </div>
      </div>
    </section>
  );
}
