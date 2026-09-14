import { useTranslation } from 'react-i18next';

import { CopyButton } from '~/components/ui/CopyButton';

interface ChecksumProps {
  file: string;
  sha256: string;
}

const VISIBLE_CHARS = 10;

export function Checksum({ file, sha256 }: ChecksumProps) {
  const { t } = useTranslation('download');

  const shortHash = `${sha256.slice(0, VISIBLE_CHARS)}…${sha256.slice(-VISIBLE_CHARS)}`;

  return (
    <div className="-my-1 flex items-center gap-2 text-body-small opacity-80">
      <span className="text-label-small">{t('asset.checksum')}</span>
      <code className="truncate font-mono" title={sha256}>
        {shortHash}
      </code>
      <CopyButton value={sha256} label={t('asset.copyChecksum', { file })} className="-my-1" />
    </div>
  );
}
