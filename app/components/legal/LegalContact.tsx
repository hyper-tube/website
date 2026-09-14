import { Trans, useTranslation } from 'react-i18next';

import { githubUrl } from '~/lib/site.shared';
import { INLINE_LINK } from '~/components/ui/link.styles';
import { useSite } from '~/hooks/useSite';

export function LegalContact() {
  const { t } = useTranslation('legal');
  const { repository } = useSite();

  return (
    <p className="border-t border-outline-variant pt-6 text-body-medium text-on-surface-variant">
      <Trans
        t={t}
        i18nKey="contact"
        components={{
          issues: (
            <a
              href={githubUrl(repository, 'issues/new/choose')}
              target="_blank"
              rel="noreferrer"
              className={INLINE_LINK}
            />
          ),
        }}
      />
    </p>
  );
}
