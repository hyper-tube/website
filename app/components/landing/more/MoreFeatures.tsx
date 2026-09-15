import PictureInPictureIcon from '~icons/material-symbols/smart-display-outline-rounded';
import PodcastsIcon from '~icons/material-symbols/podcasts-rounded';
import SensorsIcon from '~icons/material-symbols/sensors-rounded';
import KeyboardIcon from '~icons/material-symbols/keyboard-outline-rounded';
import ExtensionIcon from '~icons/material-symbols/extension-outline-rounded';
import ShieldIcon from '~icons/material-symbols/shield-outline-rounded';
import TranslateIcon from '~icons/material-symbols/translate-rounded';
import CodeIcon from '~icons/material-symbols/code-rounded';
import { useTranslation } from 'react-i18next';

import { SectionIntro } from '~/components/landing/shared/SectionIntro';

import { MoreFeature } from './MoreFeature';

const FEATURES = [
  { id: 'podcasts', icon: PodcastsIcon },
  { id: 'videos', icon: PictureInPictureIcon },
  { id: 'live', icon: SensorsIcon },
  { id: 'controls', icon: KeyboardIcon },
  { id: 'plugins', icon: ExtensionIcon },
  { id: 'privacy', icon: ShieldIcon },
  { id: 'languages', icon: TranslateIcon },
  { id: 'openSource', icon: CodeIcon },
] as const;

export function MoreFeatures() {
  const { t } = useTranslation('landing');

  return (
    <section className="container-page flex flex-col gap-14 py-24 md:py-32">
      <SectionIntro eyebrow={t('more.eyebrow')} title={t('more.title')} />

      <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ id, icon }, index) => (
          <MoreFeature
            key={id}
            icon={icon}
            index={index}
            title={t(`more.items.${id}.title`)}
            description={t(`more.items.${id}.description`)}
          />
        ))}
      </ul>
    </section>
  );
}
