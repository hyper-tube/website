import {
  data,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  type ShouldRevalidateFunctionArgs,
} from 'react-router';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';

import { getInstance, i18nextMiddleware } from '~/middlewares/i18n.server';
import { DEFAULT_THEME_PREFERENCE } from '~/lib/theme.shared';
import { getThemeFromRequest } from '~/lib/theme.server';
import { ErrorPage } from '~/components/layout/ErrorPage';
import { getStarCount } from '~/lib/releases.server';
import { localeCookie } from '~/lib/locale.server';
import { getSiteConfig } from '~/lib/site.server';
import { ThemeProvider } from '~/providers/theme';
import { SUPPORTED_LOCALES } from '~/locales';
import { pageMeta } from '~/lib/meta.shared';

import type { Route } from './+types/root';

import './app.css';

export const middleware = [i18nextMiddleware];

export const links: Route.LinksFunction = () => [
  { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
  { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' },
  { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
  {
    rel: 'preload',
    href: '/fonts/RobotoFlex-latin.woff2',
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  },
];

export async function loader({ request, context }: Route.LoaderArgs) {
  const i18n = getInstance(context);

  return data(
    {
      theme: getThemeFromRequest(request),
      locale: i18n.language,
      supportedLocales: SUPPORTED_LOCALES,
      site: getSiteConfig(request),
      stars: getStarCount(),
      meta: {
        title: i18n.t('site.title'),
        description: i18n.t('site.description'),
        absolute: true,
      },
    },
    {
      headers: {
        'Set-Cookie': await localeCookie.serialize(i18n.language),
      },
    },
  );
}

export function shouldRevalidate({ currentUrl, nextUrl }: ShouldRevalidateFunctionArgs) {
  return currentUrl.href === nextUrl.href;
}

export function meta({ loaderData, location, matches }: Route.MetaArgs) {
  return pageMeta(loaderData?.meta, location.pathname, matches);
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  const loaderData = useRouteLoaderData<typeof loader>('root');
  const theme = loaderData?.theme ?? DEFAULT_THEME_PREFERENCE;

  return (
    <html data-theme={theme} lang={i18n.language} dir={i18n.dir(i18n.language)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-svh bg-background font-sans text-on-background antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData: { locale, theme } }: Route.ComponentProps) {
  const { i18n } = useTranslation();
  const syncedLocale = useRef(locale);

  useEffect(() => {
    if (syncedLocale.current === locale) return;

    syncedLocale.current = locale;
    if (i18n.language !== locale) void i18n.changeLanguage(locale);
  }, [locale, i18n]);

  return (
    <ThemeProvider initialPreference={theme}>
      <Outlet />
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <main className="flex min-h-svh flex-col">
      <ErrorPage error={error} />
    </main>
  );
}
