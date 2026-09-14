import ArrowForwardIcon from '~icons/material-symbols/arrow-forward-rounded';
import { useTranslation } from 'react-i18next';

import { SectionIntro } from '~/components/landing/shared/SectionIntro';
import { ButtonLink } from '~/components/ui/ButtonLink';
import { FaqList } from '~/components/faq/FaqList';
import { FEATURED_FAQ } from '~/lib/faq.shared';
import { cn } from '~/lib/styles.shared';

const INITIALLY_OPEN = [FEATURED_FAQ[0]];

const SECTION = cn(
  'container-page grid gap-12 py-24 md:py-32',
  'lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20',
);

export function FaqPreview() {
  const { t } = useTranslation('landing');

  return (
    <section className={SECTION}>
      <div className="flex flex-col items-start gap-8 lg:sticky lg:top-32 lg:self-start">
        <SectionIntro title={t('faq.title')} description={t('faq.description')} />

        <ButtonLink to="/faq" variant="tonal">
          {t('faq.all')}
          <ArrowForwardIcon aria-hidden />
        </ButtonLink>
      </div>

      <FaqList items={FEATURED_FAQ} initiallyOpen={INITIALLY_OPEN} />
    </section>
  );
}
