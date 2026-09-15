import { latestRelease, listReleases, toDownloads } from '~/lib/releases.server';
import { detectRequestPlatform } from '~/lib/platforms.server';
import { getInstance } from '~/middlewares/i18n.server';
import { Benchmarks } from '~/components/landing/benchmarks/Benchmarks';
import { Playground } from '~/components/landing/playground/Playground';
import { DownloadBand } from '~/components/landing/download/DownloadBand';
import { MoreFeatures } from '~/components/landing/more/MoreFeatures';
import { FaqPreview } from '~/components/landing/faq/FaqPreview';
import { Hero } from '~/components/landing/hero/Hero';
import { pageMeta } from '~/lib/meta.shared';

import type { Route } from './+types/index';

export async function loader({ request, context }: Route.LoaderArgs) {
  const i18n = getInstance(context);
  const { releases } = await listReleases();

  const release = latestRelease(releases);

  return {
    release: release && toDownloads(release),
    platform: detectRequestPlatform(request),
    meta: {
      title: i18n.t('site.title'),
      description: i18n.t('site.description'),
      absolute: true,
    },
  };
}

export function meta({ loaderData, location, matches }: Route.MetaArgs) {
  return pageMeta(loaderData?.meta, location.pathname, matches);
}

export default function LandingRoute({ loaderData: { release, platform } }: Route.ComponentProps) {
  return (
    <div className="flex flex-col">
      <Hero release={release} platform={platform} />
      <Benchmarks />
      <Playground />
      <MoreFeatures />
      <DownloadBand release={release} platform={platform} />
      <FaqPreview />
    </div>
  );
}
