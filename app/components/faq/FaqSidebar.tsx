import { useTranslation } from 'react-i18next';

import { FAQ_CATEGORIES } from '~/lib/faq.shared';
import { cn } from '~/lib/styles.shared';

import { FaqHelp } from './FaqHelp';

const SECTION_LINK = cn(
  'state-layer -mx-3 flex h-10 items-center rounded-full px-3',
  'text-label-large text-on-surface-variant hover:text-on-surface',
);

export function FaqSidebar() {
  const { t } = useTranslation('faq');

  return (
    <aside className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
      <header className="flex flex-col gap-4">
        <h1 className="text-display-medium text-balance">{t('header.title')}</h1>
        <p className="text-body-large text-on-surface-variant">{t('header.description')}</p>
      </header>

      <nav aria-label={t('header.sections')} className="hidden flex-col lg:flex">
        {FAQ_CATEGORIES.map((category) => (
          <a key={category.id} href={`#${category.id}`} className={SECTION_LINK}>
            {t(`categories.${category.id}`)}
          </a>
        ))}
      </nav>

      <FaqHelp className="max-lg:hidden" />
    </aside>
  );
}
