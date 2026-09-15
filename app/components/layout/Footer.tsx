import { useTranslation } from 'react-i18next';

import { footerColumns } from '~/lib/navigation.shared';
import { useSite } from '~/hooks/useSite';
import { cn } from '~/lib/styles.shared';

import { FooterColumn } from './FooterColumn';
import { FooterIntro } from './FooterIntro';

const GRID = cn(
  'container-page grid grid-cols-2 gap-x-6 gap-y-10 pt-10 pb-8 sm:grid-cols-3',
  'md:grid-cols-[1.6fr_repeat(3,1fr)] md:gap-12 md:pt-14 md:pb-10',
);

const BOTTOM = 'border-t border-outline-variant/50 py-6 text-body-small text-on-surface-variant';

export function Footer() {
  const { t } = useTranslation();
  const { repository } = useSite();

  return (
    <footer className="mt-auto bg-surface-container-low">
      <div className={GRID}>
        <FooterIntro className="col-span-full md:col-span-1" />

        {footerColumns(repository).map((column) => (
          <FooterColumn key={column.titleKey} title={t(column.titleKey)} links={column.links} />
        ))}
      </div>

      <div className="container-page">
        <div className={BOTTOM}>
          <p>{t('footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  );
}
