import { useHashScrollBehavior } from '~/hooks/useHashScrollBehavior';
import { PageTransition } from '~/components/layout/PageTransition';
import { ErrorPage } from '~/components/layout/ErrorPage';
import { NavBar } from '~/components/layout/NavBar';
import { Footer } from '~/components/layout/Footer';

import type { Route } from './+types/layout';

const CONTENT_ID = 'content';

export default function SiteLayout() {
  useHashScrollBehavior();

  return (
    <div className="flex min-h-svh flex-col">
      <NavBar />

      <main id={CONTENT_ID} className="relative flex flex-1 flex-col overflow-x-clip">
        <PageTransition />
      </main>

      <Footer />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <div className="flex min-h-svh flex-col">
      <NavBar />

      <main id={CONTENT_ID} className="flex flex-1 flex-col">
        <ErrorPage error={error} />
      </main>

      <Footer />
    </div>
  );
}
