import { createHash } from 'node:crypto';

import { z } from 'zod';

import type { PackageFormat, Architecture, PlatformId } from './platforms.shared';
import type { Release } from './releases.shared';
import type { SiteConfig } from './site.shared';

export const UPDATE_SCHEMA = 1;

export const UPDATE_CHANNELS = ['stable', 'prerelease'] as const;

export type UpdateChannel = (typeof UPDATE_CHANNELS)[number];

export const updateQuerySchema = z.object({
  channel: z.enum(UPDATE_CHANNELS).default('stable'),
});

export interface UpdateAsset {
  readonly name: string;
  readonly platform: PlatformId;
  readonly format: PackageFormat;
  readonly arch: Architecture;
  readonly size: number;
  readonly url: string;
  readonly sha256: string | null;
}

export interface UpdateInfo {
  readonly schema: typeof UPDATE_SCHEMA;
  readonly channel: UpdateChannel;
  readonly version: string;
  readonly name: string;
  readonly prerelease: boolean;
  readonly publishedAt: string;
  readonly notes: string;
  readonly releaseUrl: string;
  readonly changelogUrl: string;
  readonly downloadUrl: string;
  readonly checksumsUrl: string | null;
  readonly assets: readonly UpdateAsset[];
}

const RELEASE_HEADING = /^\s*#(?!#)[^\n]*(?:\n|$)/;

export function releaseForChannel(
  releases: readonly Release[],
  channel: UpdateChannel,
): Release | null {
  if (channel === 'prerelease') return releases[0] ?? null;

  return releases.find((release) => !release.prerelease) ?? null;
}

export function releaseNotesMarkdown(markdown: string): string {
  return markdown.replace(RELEASE_HEADING, '').trim();
}

export function toUpdateInfo(
  release: Release,
  channel: UpdateChannel,
  site: SiteConfig,
): UpdateInfo {
  return {
    schema: UPDATE_SCHEMA,
    channel,
    version: release.version,
    name: release.name,
    prerelease: release.prerelease,
    publishedAt: release.publishedAt,
    notes: releaseNotesMarkdown(release.markdown),
    releaseUrl: release.url,
    changelogUrl: `${site.origin}/changelog#v${release.version}`,
    downloadUrl: `${site.origin}/download/${release.version}`,
    checksumsUrl: release.checksumsUrl,
    assets: release.assets.map(({ name, platform, format, arch, size, url, sha256 }) => ({
      name,
      platform,
      format,
      arch,
      size,
      url,
      sha256,
    })),
  };
}

export function entityTag(value: unknown): string {
  const hash = createHash('sha256').update(JSON.stringify(value)).digest('base64url');

  return `W/"${hash.slice(0, 32)}"`;
}

export function matchesEntityTag(header: string | null, tag: string): boolean {
  if (!header) return false;

  const bare = (value: string) => value.trim().replace(/^W\//, '');

  return header.split(',').some((value) => value.trim() === '*' || bare(value) === bare(tag));
}
