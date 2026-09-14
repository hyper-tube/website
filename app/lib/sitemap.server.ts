import { listReleases } from './releases.server';

const STATIC_PATHS = ['/', '/download', '/changelog', '/faq', '/terms', '/privacy'];

const escapeXml = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export async function buildSitemap(origin: string): Promise<string> {
  const { releases } = await listReleases();

  const entries = [
    ...STATIC_PATHS.map((path) => ({ path, lastModified: undefined })),
    ...releases.map((release) => ({
      path: `/download/${release.version}`,
      lastModified: release.publishedAt,
    })),
  ];

  const urls = entries.map(({ path, lastModified }) => {
    const lastmod = lastModified ? `<lastmod>${lastModified.slice(0, 10)}</lastmod>` : '';

    return `  <url><loc>${escapeXml(`${origin}${path}`)}</loc>${lastmod}</url>`;
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}
