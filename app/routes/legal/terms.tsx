import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

import { LegalDocument } from '~/components/legal/LegalDocument';
import { getInstance } from '~/middlewares/i18n.server';
import { TERMS_SECTIONS } from '~/lib/legal.shared';
import { pageMeta } from '~/lib/meta.shared';

import type { Route } from './+types/terms';

export function loader({ context }: Route.LoaderArgs) {
  const i18n = getInstance(context);

  return {
    meta: {
      title: i18n.t('legal:terms.meta.title'),
      description: i18n.t('legal:terms.meta.description'),
    },
  };
}

export function meta({ loaderData, location, matches }: Route.MetaArgs) {
  return pageMeta(loaderData?.meta, location.pathname, matches);
}

export default function TermsRoute() {
  const { t } = useTranslation('legal');

  const sections = useMemo(
    () =>
      TERMS_SECTIONS.map((id) => ({
        id,
        title: t(`terms.sections.${id}.title`),
        body: t(`terms.sections.${id}.body`),
      })),
    [t],
  );

  return (
    <LegalDocument
      title={t('terms.title')}
      description={t('terms.description')}
      sections={sections}
    />
  );
}
