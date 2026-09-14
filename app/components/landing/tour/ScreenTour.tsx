import PauseIcon from '~icons/material-symbols/pause-rounded';
import PlayIcon from '~icons/material-symbols/play-arrow-rounded';
import { useInView, useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useId, useMemo, useRef, useState } from 'react';

import { SCREENSHOT_SIZES, TOUR_INTERVAL, TOUR_SCREENS, screenshotSrcSet } from '~/lib/tour.shared';
import { resolveTheme } from '~/lib/theme';
import { useTheme } from '~/providers/theme';
import { usePreloadImages } from '~/hooks/usePreloadImages';
import { usePageVisible } from '~/hooks/usePageVisible';
import { useTourCycle } from '~/hooks/useTourCycle';
import { Button } from '~/components/ui/Button';

import { TourCaption } from './TourCaption';
import { TourStage } from './TourStage';
import { TourTabs } from './TourTabs';

export function ScreenTour() {
  const { t } = useTranslation('landing');
  const idPrefix = useId().replaceAll(':', '');
  const shouldReduceMotion = useReducedMotion();
  const pageVisible = usePageVisible();

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });

  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const running = !paused && !hovered && inView && pageVisible && !shouldReduceMotion;
  const { index, progress, select } = useTourCycle(TOUR_SCREENS.length, TOUR_INTERVAL, running);

  const screen = TOUR_SCREENS[index];
  const tabId = (item: string) => `${idPrefix}-tour-${item}`;
  const panelId = `${idPrefix}-tour-panel`;

  const { preference } = useTheme();

  const upcoming = useMemo(
    () =>
      inView
        ? TOUR_SCREENS.map((item) => ({
            srcSet: screenshotSrcSet(item, resolveTheme(preference)),
            sizes: SCREENSHOT_SIZES,
          }))
        : [],
    [inView, preference],
  );

  usePreloadImages(upcoming, inView);

  return (
    <div ref={ref} className="flex flex-col gap-6">
      <TourStage
        screen={screen}
        panelId={panelId}
        labelledBy={tabId(screen)}
        onHoverChange={setHovered}
      />

      <div className="flex items-center justify-center gap-2">
        <TourTabs
          current={screen}
          progress={progress}
          onSelect={select}
          tabId={tabId}
          panelId={panelId}
        />

        <Button
          variant="standard"
          icon
          aria-label={paused ? t('tour.play') : t('tour.pause')}
          onClick={() => setPaused((value) => !value)}
          className="max-sm:hidden"
        >
          {paused ? <PlayIcon aria-hidden /> : <PauseIcon aria-hidden />}
        </Button>
      </div>

      <TourCaption screen={screen} />
    </div>
  );
}
