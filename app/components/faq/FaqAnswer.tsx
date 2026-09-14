import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import type { FaqId } from '~/lib/faq.shared';
import { githubUrl } from '~/lib/site.shared';
import { INLINE_CODE, INLINE_LINK } from '~/components/ui/link.styles';
import { useSite } from '~/hooks/useSite';

interface FaqAnswerProps {
  id: FaqId;
}

export function FaqAnswer({ id }: FaqAnswerProps) {
  const { t } = useTranslation('faq');
  const { repository } = useSite();

  return (
    <p>
      <Trans
        t={t}
        i18nKey={`items.${id}.answer`}
        components={{
          download: <Link to="/download" className={INLINE_LINK} />,
          changelog: <Link to="/changelog" className={INLINE_LINK} />,
          privacy: <Link to="/privacy" className={INLINE_LINK} />,
          source: (
            <a
              href={githubUrl(repository)}
              target="_blank"
              rel="noreferrer"
              className={INLINE_LINK}
            />
          ),
          issues: (
            <a
              href={githubUrl(repository, 'issues/new/choose')}
              target="_blank"
              rel="noreferrer"
              className={INLINE_LINK}
            />
          ),
          code: <code className={INLINE_CODE} />,
        }}
      />
    </p>
  );
}
