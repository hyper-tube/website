import type { Root } from 'hast';

import {
  PLATFORMS,
  PLATFORM_FORMATS,
  type Architecture,
  type PackageFormat,
  type PlatformId,
} from './platforms.shared';

export interface ReleaseAsset {
  readonly name: string;
  readonly platform: PlatformId;
  readonly format: PackageFormat;
  readonly arch: Architecture;
  readonly size: number;
  readonly downloads: number;
  readonly url: string;
  readonly sha256: string | null;
}

export interface ReleaseSummary {
  readonly version: string;
  readonly name: string;
  readonly publishedAt: string;
  readonly prerelease: boolean;
  readonly url: string;
  readonly downloads: number;
}

export interface ReleaseDownloads extends ReleaseSummary {
  readonly assets: readonly ReleaseAsset[];
  readonly checksumsUrl: string | null;
}

export interface ReleaseNotes extends ReleaseSummary {
  readonly notes: Root | null;
}

export interface Release extends ReleaseDownloads, ReleaseNotes {
  readonly markdown: string;
}

export interface PlatformDownloads {
  readonly platform: PlatformId;
  readonly assets: readonly ReleaseAsset[];
}

export function versionFromTag(tag: string): string {
  return tag.replace(/^v/, '');
}

export function groupByPlatform(
  assets: readonly ReleaseAsset[],
  first: PlatformId | null = null,
): PlatformDownloads[] {
  const order = first ? [first, ...PLATFORMS.filter((platform) => platform !== first)] : PLATFORMS;

  return order.map((platform) => ({
    platform,
    assets: PLATFORM_FORMATS[platform].flatMap((format) =>
      assets.filter((asset) => asset.format === format),
    ),
  }));
}

export function primaryAsset(
  assets: readonly ReleaseAsset[],
  platform: PlatformId,
): ReleaseAsset | null {
  for (const format of PLATFORM_FORMATS[platform]) {
    const asset = assets.find((candidate) => candidate.format === format);
    if (asset) return asset;
  }

  return null;
}
