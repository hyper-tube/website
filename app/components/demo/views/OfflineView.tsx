import CloudOffIcon from '~icons/material-symbols/cloud-off-rounded';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import { useDemoPlayer } from '~/providers/demo-player';
import { DEMO_TRACKS } from '~/lib/demo-songs.shared';
import { TRANSITIONS } from '~/lib/motion.shared';
import { Switch } from '~/components/ui/Switch';
import { cn } from '~/lib/styles.shared';

import { OfflineRow } from './OfflineRow';
import { ViewHeader } from './ViewHeader';

const CHIP = cn(
  'inline-flex h-8 items-center gap-2 rounded-full bg-surface-container-high px-3',
  'text-label-large text-on-surface',
);

export function OfflineView() {
  const { t } = useTranslation('landing');
  const { offline, setOffline } = useDemoPlayer();

  return (
    <div className="flex flex-col">
      <ViewHeader
        title={t('playground.offline.title')}
        action={
          <label className="flex items-center gap-3 text-label-large text-on-surface-variant">
            {t('playground.offline.simulate')}
            <Switch
              checked={offline}
              onChange={setOffline}
              label={t('playground.offline.simulate')}
            />
          </label>
        }
      />

      <AnimatePresence initial={false}>
        {offline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={TRANSITIONS.spatial}
            className="overflow-hidden"
          >
            <div className="pt-4">
              <span className={CHIP}>
                <CloudOffIcon aria-hidden className="size-4" />
                {t('playground.offline.offline')}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ul className="mt-4 flex flex-col">
        {DEMO_TRACKS.map((track) => (
          <OfflineRow key={track.id} track={track} />
        ))}
      </ul>
    </div>
  );
}
