import { useTranslation } from 'react-i18next';

import { footerColumns } from '~/lib/navigation.shared';
import { useSite } from '~/hooks/useSite';

import { FooterColumn } from './FooterColumn';
import { FooterIntro } from './FooterIntro';

const BOTTOM = 'border-t border-outline-variant/50 py-6 text-body-small text-on-surface-variant';

export function Footer() {
  const { t } = useTranslation();
  const { repository } = useSite();

  return (
    <footer className="mt-auto bg-surface-container-low">
      <div className="container-page grid gap-12 py-14 md:grid-cols-[1.6fr_repeat(3,1fr)]">
        <FooterIntro />

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
