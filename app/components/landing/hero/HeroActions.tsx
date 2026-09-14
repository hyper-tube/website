import { useTranslation } from 'react-i18next';

import { primaryAsset, type ReleaseDownloads } from '~/lib/releases.shared';
import type { PlatformId } from '~/lib/platforms.shared';
import { ButtonAnchor } from '~/components/ui/ButtonAnchor';
import { PlatformIcon } from '~/components/ui/PlatformIcon';
import { ButtonLink } from '~/components/ui/ButtonLink';
import { formatBytes } from '~/lib/format.shared';

interface HeroActionsProps {
  release: ReleaseDownloads | null;
  platform: PlatformId | null;
}

export function HeroActions({ release, platform }: HeroActionsProps) {
  const { t, i18n } = useTranslation(['landing', 'download']);

  if (!release) {
    return (
      <ButtonLink to="/download" size="lg" className="self-start">
        {t('landing:hero.downloadGeneric')}
      </ButtonLink>
    );
  }

  const primary = platform ? primaryAsset(release.assets, platform) : null;

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap gap-2">
        {primary && platform ? (
          <ButtonAnchor href={primary.url} size="lg">
            <PlatformIcon platform={platform} />
            {t('landing:hero.download', { platform: t(`download:platforms.${platform}.name`) })}
          </ButtonAnchor>
        ) : (
          <ButtonLink to="/download" size="lg">
            {t('landing:hero.downloadGeneric')}
          </ButtonLink>
        )}

        {primary && (
          <ButtonLink to="/download" variant="tonal" size="lg">
            {t('landing:hero.otherSystems')}
          </ButtonLink>
        )}
      </div>

      <p className="text-body-medium text-on-surface-variant">
        {primary
          ? t('landing:hero.details', {
              version: release.version,
              size: formatBytes(primary.size, i18n.language),
            })
          : t('landing:hero.detailsShort', { version: release.version })}
      </p>
    </div>
  );
}
