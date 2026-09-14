import { useTranslation } from 'react-i18next';

import { LEGAL_UPDATED, type LegalSection } from '~/lib/legal.shared';
import { formatDate } from '~/lib/format.shared';

import { LegalContents } from './LegalContents';
import { LegalContact } from './LegalContact';
import { LegalBlock } from './LegalBlock';

interface LegalDocumentProps {
  title: string;
  description: string;
  sections: readonly LegalSection[];
}

export function LegalDocument({ title, description, sections }: LegalDocumentProps) {
  const { t, i18n } = useTranslation('legal');

  return (
    <div className="container-page grid gap-12 py-12 md:py-16 lg:grid-cols-[1fr_16rem] lg:gap-20">
      <article className="flex max-w-3xl min-w-0 flex-col gap-12">
        <header className="flex flex-col gap-4">
          <p className="text-label-large text-primary">
            {t('updated', { date: formatDate(LEGAL_UPDATED, i18n.language) })}
          </p>
          <h1 className="text-display-large">{title}</h1>
          <p className="text-body-large text-pretty text-on-surface-variant">{description}</p>
        </header>

        <div className="flex flex-col gap-10">
          {sections.map((section, index) => (
            <LegalBlock key={section.id} section={section} index={index} />
          ))}
        </div>

        <LegalContact />
      </article>

      <LegalContents sections={sections} />
    </div>
  );
}
