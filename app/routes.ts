import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

export default [
  layout('routes/layout.tsx', [
    index('routes/index.tsx'),

    ...prefix('/download', [
      index('routes/download/index.tsx'),
      route(':version', 'routes/download/$version.tsx'),
    ]),

    route('/changelog', 'routes/changelog.tsx'),
    route('/faq', 'routes/faq.tsx'),

    route('/terms', 'routes/legal/terms.tsx'),
    route('/privacy', 'routes/legal/privacy.tsx'),

    route('*', 'routes/catchall.tsx'),
  ]),

  route('/download/latest/:format', 'routes/download/latest.ts'),

  ...prefix('/api', [
    route('health', 'routes/api/health.ts'),
    route('releases/latest', 'routes/api/latest-release.ts'),
  ]),

  route('/sitemap.xml', 'routes/seo/sitemap.ts'),
  route('/robots.txt', 'routes/seo/robots.ts'),
] satisfies RouteConfig;
