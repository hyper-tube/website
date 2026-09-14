import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

import { LegalDocument } from '~/components/legal/LegalDocument';
import { getInstance } from '~/middlewares/i18n.server';
import { PRIVACY_SECTIONS } from '~/lib/legal.shared';
import { pageMeta } from '~/lib/meta.shared';

import type { Route } from './+types/privacy';

export function loader({ context }: Route.LoaderArgs) {
  const i18n = getInstance(context);

  return {
    meta: {
      title: i18n.t('legal:privacy.meta.title'),
      description: i18n.t('legal:privacy.meta.description'),
    },
  };
}

export function meta({ loaderData, location, matches }: Route.MetaArgs) {
  return pageMeta(loaderData?.meta, location.pathname, matches);
}

export default function PrivacyRoute() {
  const { t } = useTranslation('legal');

  const sections = useMemo(
    () =>
      PRIVACY_SECTIONS.map((id) => ({
        id,
        title: t(`privacy.sections.${id}.title`),
        body: t(`privacy.sections.${id}.body`),
      })),
    [t],
  );

  return (
    <LegalDocument
      title={t('privacy.title')}
      description={t('privacy.description')}
      sections={sections}
    />
  );
}
