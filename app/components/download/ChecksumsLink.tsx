import DownloadIcon from '~icons/material-symbols/download-rounded';
import { useTranslation } from 'react-i18next';

import { INLINE_LINK } from '~/components/ui/link.styles';
import { cn } from '~/lib/styles.shared';

interface ChecksumsLinkProps {
  url: string;
}

export function ChecksumsLink({ url }: ChecksumsLinkProps) {
  const { t } = useTranslation('download');

  return (
    <a
      href={url}
      className={cn(INLINE_LINK, 'inline-flex items-center gap-2 self-start text-label-large')}
    >
      <DownloadIcon aria-hidden className="size-5" />
      {t('asset.checksums')}
    </a>
  );
}
