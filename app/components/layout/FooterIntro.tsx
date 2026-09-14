import { useTranslation } from 'react-i18next';

import { SITE_NAME } from '~/lib/site.shared';
import { Logo } from '~/components/ui/Logo';

export function FooterIntro() {
  const { t } = useTranslation();

  return (
    <div className="flex max-w-sm flex-col gap-4">
      <div className="flex items-center gap-3">
        <Logo className="size-10" />
        <span className="text-title-large">{SITE_NAME}</span>
      </div>

      <p className="text-body-medium text-on-surface-variant">{t('footer.tagline')}</p>
    </div>
  );
}
