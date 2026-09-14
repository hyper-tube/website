import { useTranslation } from 'react-i18next';

import {
  SCREENSHOT_SIZE,
  SCREENSHOT_SIZES,
  screenshotPath,
  screenshotSrcSet,
  type TourScreen,
} from '~/lib/tour.shared';
import type { Theme } from '~/lib/theme.shared';
import { useTheme } from '~/providers/theme';

interface TourScreenshotProps {
  screen: TourScreen;
  eager: boolean;
}

export function TourScreenshot({ screen, eager }: TourScreenshotProps) {
  const { t } = useTranslation('landing');
  const { preference } = useTheme();

  const theme: Theme = preference === 'dark' ? 'dark' : 'light';
  const alt = t('tour.alt', { screen: t(`tour.screens.${screen}.name`) });

  const image = (
    <img
      src={screenshotPath(screen, theme)}
      srcSet={screenshotSrcSet(screen, theme)}
      sizes={SCREENSHOT_SIZES}
      alt={alt}
      width={SCREENSHOT_SIZE.width}
      height={SCREENSHOT_SIZE.height}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
      draggable={false}
      className="size-full select-none"
    />
  );

  if (preference !== 'system') return image;

  return (
    <picture>
      <source
        media="(prefers-color-scheme: dark)"
        srcSet={screenshotSrcSet(screen, 'dark')}
        sizes={SCREENSHOT_SIZES}
      />
      {image}
    </picture>
  );
}
