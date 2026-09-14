import CopyIcon from '~icons/material-symbols/content-copy-outline-rounded';
import { AnimatePresence, motion } from 'motion/react';
import CheckIcon from '~icons/material-symbols/check-rounded';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import { TRANSITIONS } from '~/lib/motion.shared';

import { Button } from './Button';

interface CopyButtonProps {
  value: string;
  label: string;
  className?: string;
}

const CONFIRMATION_DURATION = 1800;

const GLYPH = {
  initial: { scale: 0.4, opacity: 0, rotate: -30 },
  animate: { scale: 1, opacity: 1, rotate: 0 },
  exit: { scale: 0.4, opacity: 0, rotate: 30 },
  transition: TRANSITIONS.fastSpatial,
};

export function CopyButton({ value, label, className }: CopyButtonProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timeout = window.setTimeout(() => setCopied(false), CONFIRMATION_DURATION);

    return () => window.clearTimeout(timeout);
  }, [copied]);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
  };

  return (
    <Button
      variant="standard"
      size="sm"
      icon
      aria-label={copied ? t('actions.copied') : label}
      onClick={() => void copy()}
      className={className}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={copied ? 'check' : 'copy'} {...GLYPH} className="grid place-items-center">
          {copied ? <CheckIcon aria-hidden className="text-primary" /> : <CopyIcon aria-hidden />}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
