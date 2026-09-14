import { z } from 'zod';

import { env } from './env.server';

const API_ROOT = 'https://api.github.com';
const API_VERSION = '2022-11-28';
const REQUEST_TIMEOUT = 5_000;
const PAGE_SIZE = 100;
const MAX_PAGES = 10;

const NEXT_LINK = /<([^>]+)>;\s*rel="next"/;

export const githubAssetSchema = z.object({
  id: z.number(),
  name: z.string(),
  size: z.number(),
  download_count: z.number(),
  browser_download_url: z.url(),
  digest: z.string().nullish(),
});

export const githubReleaseSchema = z.object({
  id: z.number(),
  tag_name: z.string(),
  name: z.string().nullable(),
  body: z.string().nullish(),
  draft: z.boolean(),
  prerelease: z.boolean(),
  created_at: z.string(),
  published_at: z.string().nullable(),
  html_url: z.url(),
  assets: z.array(githubAssetSchema),
});

export const githubRepositorySchema = z.object({
  full_name: z.string(),
  stargazers_count: z.number(),
});

export type GitHubRelease = z.infer<typeof githubReleaseSchema>;
export type GitHubRepository = z.infer<typeof githubRepositorySchema>;

export class GitHubError extends Error {
  constructor(
    readonly status: number,
    readonly url: string,
  ) {
    super(`GitHub answered ${status} for ${url}`);
    this.name = 'GitHubError';
  }
}

interface JsonResponse {
  readonly body: unknown;
  readonly next: string | null;
}

interface ConditionalEntry extends JsonResponse {
  readonly etag: string;
}

const conditionalResponses = new Map<string, ConditionalEntry>();

function requestHeaders(etag?: string): Headers {
  const headers = new Headers({
    Accept: 'application/vnd.github+json',
    'User-Agent': 'ht-website',
    'X-GitHub-Api-Version': API_VERSION,
  });

  if (env.GITHUB_TOKEN) headers.set('Authorization', `Bearer ${env.GITHUB_TOKEN}`);
  if (etag) headers.set('If-None-Match', etag);

  return headers;
}

async function getJson(url: string): Promise<JsonResponse> {
  const previous = conditionalResponses.get(url);

  const response = await fetch(url, {
    headers: requestHeaders(previous?.etag),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  });

  if (response.status === 304 && previous) return previous;
  if (!response.ok) throw new GitHubError(response.status, url);

  const result: JsonResponse = {
    body: await response.json(),
    next: response.headers.get('link')?.match(NEXT_LINK)?.[1] ?? null,
  };

  const etag = response.headers.get('etag');
  if (etag) conditionalResponses.set(url, { etag, ...result });

  return result;
}

export async function fetchRepository(repository: string): Promise<GitHubRepository> {
  const { body } = await getJson(`${API_ROOT}/repos/${repository}`);

  return githubRepositorySchema.parse(body);
}

export async function fetchReleases(repository: string): Promise<GitHubRelease[]> {
  const releases: GitHubRelease[] = [];
  let url: string | null = `${API_ROOT}/repos/${repository}/releases?per_page=${PAGE_SIZE}`;

  for (let page = 0; url && page < MAX_PAGES; page++) {
    const response = await getJson(url);

    releases.push(...z.array(githubReleaseSchema).parse(response.body));
    url = response.next;
  }

  return releases;
}
