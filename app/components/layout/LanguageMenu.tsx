import TranslateIcon from '~icons/material-symbols/translate-rounded';
import { useRevalidator, useRouteLoaderData } from 'react-router';
import { useTranslation } from 'react-i18next';

import { MenuItem } from '~/components/ui/MenuItem';
import { LOCALE_NAMES } from '~/lib/locale.shared';
import { Button } from '~/components/ui/Button';
import { localeCookie } from '~/lib/locale';
import { Menu } from '~/components/ui/Menu';
import type { loader } from '~/root';

export function LanguageMenu() {
  const { t, i18n } = useTranslation();
  const { revalidate } = useRevalidator();

  const locales = useRouteLoaderData<typeof loader>('root')?.supportedLocales ?? [];
  const current = i18n.resolvedLanguage ?? i18n.language;

  const changeLanguage = async (locale: string) => {
    localeCookie.set(locale, { secure: window.location.protocol === 'https:' });

    await i18n.changeLanguage(locale);
    await revalidate();
  };

  return (
    <Menu
      label={t('header.language')}
      trigger={(props) => (
        <Button variant="standard" icon aria-label={t('header.language')} {...props}>
          <TranslateIcon aria-hidden />
        </Button>
      )}
    >
      {locales.map((locale) => (
        <MenuItem
          key={locale}
          lang={locale}
          checked={locale === current}
          onSelect={() => void changeLanguage(locale)}
        >
          {LOCALE_NAMES[locale] ?? locale}
        </MenuItem>
      ))}
    </Menu>
  );
}
