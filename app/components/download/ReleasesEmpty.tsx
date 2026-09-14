import PackageIcon from '~icons/material-symbols/package-2-outline-rounded';
import OpenInNewIcon from '~icons/material-symbols/open-in-new-rounded';
import CloudOffIcon from '~icons/material-symbols/cloud-off-rounded';
import { useTranslation } from 'react-i18next';

import { ButtonAnchor } from '~/components/ui/ButtonAnchor';
import { EmptyState } from '~/components/ui/EmptyState';
import { githubUrl } from '~/lib/site.shared';
import { useSite } from '~/hooks/useSite';

interface ReleasesEmptyProps {
  available: boolean;
}

export function ReleasesEmpty({ available }: ReleasesEmptyProps) {
  const { t } = useTranslation('download');
  const { repository } = useSite();

  return (
    <EmptyState
      icon={available ? PackageIcon : CloudOffIcon}
      title={available ? t('empty.title') : t('empty.unavailableTitle')}
      description={available ? t('empty.description') : t('empty.unavailableDescription')}
    >
      <ButtonAnchor href={githubUrl(repository, 'releases')} external variant="tonal">
        {t('empty.action')}
        <OpenInNewIcon aria-hidden />
      </ButtonAnchor>
    </EmptyState>
  );
}
