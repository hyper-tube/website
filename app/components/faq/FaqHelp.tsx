import OpenInNewIcon from '~icons/material-symbols/open-in-new-rounded';
import { useTranslation } from 'react-i18next';

import { ButtonAnchor } from '~/components/ui/ButtonAnchor';
import { githubUrl } from '~/lib/site.shared';
import { useSite } from '~/hooks/useSite';
import { cn } from '~/lib/styles.shared';

interface FaqHelpProps {
  className?: string;
}

export function FaqHelp({ className }: FaqHelpProps) {
  const { t } = useTranslation('faq');
  const { repository } = useSite();

  return (
    <div
      className={cn(
        'flex flex-col items-start gap-3 rounded-large bg-surface-container p-5',
        className,
      )}
    >
      <p className="text-title-medium">{t('header.stillStuck')}</p>

      <ButtonAnchor
        href={githubUrl(repository, 'issues/new/choose')}
        external
        variant="tonal"
        size="sm"
      >
        {t('header.ask')}
        <OpenInNewIcon aria-hidden />
      </ButtonAnchor>
    </div>
  );
}
