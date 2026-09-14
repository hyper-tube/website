import DownloadIcon from '~icons/material-symbols/download-rounded';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { primaryAsset, type ReleaseAsset } from '~/lib/releases.shared';
import { useMotionTransition } from '~/hooks/useMotionTransition';
import { PLATFORM_FORMATS, type PlatformId } from '~/lib/platforms.shared';
import { ButtonAnchor } from '~/components/ui/ButtonAnchor';
import { TRANSITIONS } from '~/lib/motion.shared';
import { formatBytes } from '~/lib/format.shared';

interface DownloadBandActionProps {
  assets: readonly ReleaseAsset[];
  platform: PlatformId;
}

const SWAP = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export function DownloadBandAction({ assets, platform }: DownloadBandActionProps) {
  const { t, i18n } = useTranslation(['landing', 'download']);
  const transition = useMotionTransition(TRANSITIONS.enter);

  const primary = primaryAsset(assets, platform);
  const others = PLATFORM_FORMATS[platform]
    .filter(
      (format) => format !== primary?.format && assets.some((asset) => asset.format === format),
    )
    .map((format) => t(`download:formats.${format}.name`));

  return (
    <div className="flex min-h-36 flex-col gap-3 lg:items-end">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={platform}
          {...SWAP}
          transition={transition}
          className="flex flex-col gap-3 lg:items-end"
        >
          {primary ? (
            <>
              <ButtonAnchor href={primary.url} size="lg">
                <DownloadIcon aria-hidden />
                {t('landing:download.button', {
                  platform: t(`download:platforms.${platform}.name`),
                })}
              </ButtonAnchor>

              <p className="text-body-medium opacity-80">
                {t(`download:formats.${primary.format}.name`)} ·{' '}
                {formatBytes(primary.size, i18n.language)}
                {others.length > 0 &&
                  ` · ${t('landing:download.other', { formats: others.join(', ') })}`}
              </p>
            </>
          ) : (
            <p className="text-body-large opacity-80">{t('landing:download.unavailable')}</p>
          )}
        </motion.div>
      </AnimatePresence>

      <Link
        to="/download"
        className="text-label-large underline underline-offset-4 opacity-90 hover:opacity-100"
      >
        {t('landing:download.all')}
      </Link>
    </div>
  );
}
