import { LayoutGroup, type MotionValue } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useRef, type KeyboardEvent } from 'react';

import { TOUR_SCREENS, type TourScreen } from '~/lib/tour.shared';
import { nextHorizontalIndex } from '~/lib/focus';
import { cn } from '~/lib/styles.shared';

import { TourTab } from './TourTab';

const LIST = cn(
  '-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none]',
  'sm:mx-0 sm:justify-center sm:px-0',
);

interface TourTabsProps {
  current: TourScreen;
  progress: MotionValue<number>;
  onSelect: (index: number) => void;
  tabId: (screen: TourScreen) => string;
  panelId: string;
}

export function TourTabs({ current, progress, onSelect, tabId, panelId }: TourTabsProps) {
  const { t } = useTranslation('landing');
  const ref = useRef<HTMLDivElement>(null);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = nextHorizontalIndex(event.key, TOUR_SCREENS.indexOf(current), TOUR_SCREENS.length);
    if (next === null) return;

    event.preventDefault();
    onSelect(next);
    ref.current?.querySelector<HTMLElement>(`#${tabId(TOUR_SCREENS[next])}`)?.focus();
  };

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={t('tour.label')}
      onKeyDown={onKeyDown}
      className={LIST}
    >
      <LayoutGroup id="tour-tabs">
        {TOUR_SCREENS.map((screen, index) => (
          <TourTab
            key={screen}
            id={tabId(screen)}
            panelId={panelId}
            label={t(`tour.screens.${screen}.name`)}
            selected={screen === current}
            progress={progress}
            onSelect={() => onSelect(index)}
          />
        ))}
      </LayoutGroup>
    </div>
  );
}
