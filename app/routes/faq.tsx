import { useTranslation } from 'react-i18next';

import { FAQ_CATEGORIES } from '~/lib/faq.shared';
import { FaqSidebar } from '~/components/faq/FaqSidebar';
import { getInstance } from '~/middlewares/i18n.server';
import { FaqList } from '~/components/faq/FaqList';
import { FaqHelp } from '~/components/faq/FaqHelp';
import { pageMeta } from '~/lib/meta.shared';

import type { Route } from './+types/faq';

export function loader({ context }: Route.LoaderArgs) {
  const i18n = getInstance(context);

  return {
    meta: {
      title: i18n.t('faq:meta.title'),
      description: i18n.t('faq:meta.description'),
    },
  };
}

export function meta({ loaderData, location, matches }: Route.MetaArgs) {
  return pageMeta(loaderData?.meta, location.pathname, matches);
}

export default function FaqRoute() {
  const { t } = useTranslation('faq');

  return (
    <div className="container-page grid gap-12 py-12 md:py-16 lg:grid-cols-[20rem_1fr] lg:gap-20">
      <FaqSidebar />

      <div className="flex min-w-0 flex-col gap-14">
        {FAQ_CATEGORIES.map((category) => (
          <section key={category.id} id={category.id} className="scroll-mt-28">
            <h2 className="mb-2 text-title-medium text-primary">
              {t(`categories.${category.id}`)}
            </h2>

            <FaqList items={category.items} anchors />
          </section>
        ))}

        <FaqHelp className="lg:hidden" />
      </div>
    </div>
  );
}
