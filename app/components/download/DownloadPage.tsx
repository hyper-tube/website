import type { ReleaseDownloads, ReleaseSummary } from '~/lib/releases.shared';
import type { PlatformId } from '~/lib/platforms.shared';

import { ReleaseHistory } from './ReleaseHistory';
import { DownloadHeader } from './DownloadHeader';
import { ReleasesEmpty } from './ReleasesEmpty';
import { InstallGuide } from './InstallGuide';
import { ChecksumsLink } from './ChecksumsLink';
import { PlatformGrid } from './PlatformGrid';

interface DownloadPageProps {
  release: ReleaseDownloads | null;
  history: readonly ReleaseSummary[];
  latestVersion: string | null;
  platform: PlatformId | null;
  available: boolean;
}

export function DownloadPage({
  release,
  history,
  latestVersion,
  platform,
  available,
}: DownloadPageProps) {
  if (!release) return <ReleasesEmpty available={available} />;

  return (
    <div className="container-page flex flex-col gap-20 py-12 md:py-16">
      <div className="flex flex-col gap-10">
        <DownloadHeader release={release} latestVersion={latestVersion} />
        <PlatformGrid assets={release.assets} platform={platform} />
        {release.checksumsUrl && <ChecksumsLink url={release.checksumsUrl} />}
      </div>

      <InstallGuide key={release.version} assets={release.assets} platform={platform} />

      <ReleaseHistory releases={history} current={release.version} latestVersion={latestVersion} />
    </div>
  );
}
