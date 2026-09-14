import { useTranslation } from 'react-i18next';

import type { LegalSection } from '~/lib/legal.shared';
import { cn } from '~/lib/styles.shared';

interface LegalContentsProps {
  sections: readonly LegalSection[];
}

const LINK = cn(
  'state-layer -mx-3 flex min-h-10 items-center rounded-full px-3 py-2',
  'text-body-medium text-on-surface-variant hover:text-on-surface',
);

const NAV = 'hidden flex-col gap-2 lg:sticky lg:top-28 lg:flex lg:self-start';

export function LegalContents({ sections }: LegalContentsProps) {
  const { t } = useTranslation('legal');

  return (
    <nav aria-label={t('contents')} className={NAV}>
      <p className="text-title-small">{t('contents')}</p>

      {sections.map((section) => (
        <a key={section.id} href={`#${section.id}`} className={LINK}>
          {section.title}
        </a>
      ))}
    </nav>
  );
}
