import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { z } from 'zod';

import { createLogger } from '../../server/logger';

import {
  fetchReleases,
  fetchRepository,
  githubReleaseSchema,
  type GitHubRelease,
} from './github.server';
import {
  versionFromTag,
  type Release,
  type ReleaseAsset,
  type ReleaseDownloads,
  type ReleaseNotes,
  type ReleaseSummary,
} from './releases.shared';
import { parseReleaseNotes } from './markdown.server';
import { classifyAsset } from './platforms.shared';
import { StaleCache } from './cache.server';
import { settleWithin } from './async.shared';
import { env } from './env.server';

const log = createLogger('github');

const STAR_COUNT_DEADLINE = 1_500;

const VERSION_PATTERN = /^v?(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/;

const CHECKSUMS_FILE = /^sha256sums(?:\.txt)?$/i;
const SHA256_DIGEST = /^sha256:([a-f0-9]{64})$/i;

export const versionParam = z
  .string()
  .regex(VERSION_PATTERN)
  .transform((value) => value.replace(/^v/, ''));

export interface ReleaseList {
  readonly releases: readonly Release[];
  readonly available: boolean;
}

const reportError = (key: string, error: unknown) =>
  log.warn(`Loading ${key} from GitHub failed`, error instanceof Error ? error.message : error);

const releaseCache = new StaleCache<Release[]>(env.GITHUB_CACHE_TTL, reportError);
const starCache = new StaleCache<number>(env.GITHUB_CACHE_TTL, reportError);

async function readFixture(path: string): Promise<GitHubRelease[]> {
  const file = await readFile(resolve(path), 'utf8');

  return z.array(githubReleaseSchema).parse(JSON.parse(file));
}

function toAsset(asset: GitHubRelease['assets'][number]): ReleaseAsset | null {
  const kind = classifyAsset(asset.name);
  if (!kind) return null;

  return {
    ...kind,
    name: asset.name,
    size: asset.size,
    downloads: asset.download_count,
    url: asset.browser_download_url,
    sha256: asset.digest?.match(SHA256_DIGEST)?.[1] ?? null,
  };
}

function toRelease(release: GitHubRelease): Release {
  const assets = release.assets.map(toAsset).filter((asset) => asset !== null);

  return {
    version: versionFromTag(release.tag_name),
    name: release.name?.trim() || versionFromTag(release.tag_name),
    publishedAt: release.published_at ?? release.created_at,
    prerelease: release.prerelease,
    url: release.html_url,
    assets,
    downloads: assets.reduce((total, asset) => total + asset.downloads, 0),
    checksumsUrl:
      release.assets.find((asset) => CHECKSUMS_FILE.test(asset.name))?.browser_download_url ?? null,
    notes: parseReleaseNotes(release.body ?? '', env.GITHUB_REPOSITORY),
    markdown: release.body ?? '',
  };
}

async function loadReleases(): Promise<Release[]> {
  const releases = env.GITHUB_RELEASES_FIXTURE
    ? await readFixture(env.GITHUB_RELEASES_FIXTURE)
    : await fetchReleases(env.GITHUB_REPOSITORY);

  return releases
    .filter((release) => !release.draft)
    .map(toRelease)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export async function listReleases(): Promise<ReleaseList> {
  try {
    const releases = await releaseCache.get(`releases:${env.GITHUB_REPOSITORY}`, loadReleases);

    return { releases, available: true };
  } catch {
    return { releases: [], available: false };
  }
}

export function latestRelease(releases: readonly Release[]): Release | null {
  return releases.find((release) => !release.prerelease) ?? releases[0] ?? null;
}

async function loadStarCount(): Promise<number | null> {
  try {
    return await starCache.get(`repository:${env.GITHUB_REPOSITORY}`, async () => {
      const repository = await fetchRepository(env.GITHUB_REPOSITORY);

      return repository.stargazers_count;
    });
  } catch {
    return null;
  }
}

export function getStarCount(): Promise<number | null> {
  return settleWithin(loadStarCount(), STAR_COUNT_DEADLINE, null);
}

export function toSummary(release: Release): ReleaseSummary {
  const { version, name, publishedAt, prerelease, url, downloads } = release;

  return { version, name, publishedAt, prerelease, url, downloads };
}

export function toDownloads(release: Release): ReleaseDownloads {
  return { ...toSummary(release), assets: release.assets, checksumsUrl: release.checksumsUrl };
}

export function toNotes(release: Release): ReleaseNotes {
  return { ...toSummary(release), notes: release.notes };
}
