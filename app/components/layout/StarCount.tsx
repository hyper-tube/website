import StarIcon from '~icons/material-symbols/star-rounded';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

import { formatCompact } from '~/lib/format.shared';
import { TRANSITIONS } from '~/lib/motion.shared';

interface StarCountProps {
  value: number | null;
}

export function StarCount({ value }: StarCountProps) {
  const { t, i18n } = useTranslation();

  if (value === null) {
    return <span>{t('header.github')}</span>;
  }

  return (
    <motion.span
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={TRANSITIONS.fastSpatial}
      className="flex items-center gap-1 tabular-nums"
    >
      <StarIcon aria-hidden className="text-primary" />
      {formatCompact(value, i18n.language)}
    </motion.span>
  );
}
