import { useScrolled } from '~/hooks/useScrolled';
import { cn } from '~/lib/styles.shared';

import { NavigationProgress } from './NavigationProgress';
import { MobileMenuButton } from './MobileMenuButton';
import { LanguageMenu } from './LanguageMenu';
import { GitHubStars } from './GitHubStars';
import { ThemeToggle } from './ThemeToggle';
import { NavLinks } from './NavLinks';
import { Brand } from './Brand';

const HEADER = 'sticky top-0 z-40 w-full transition-colors duration-300 ease-effects';

export function NavBar() {
  const scrolled = useScrolled();

  return (
    <header className={cn(HEADER, scrolled ? 'bg-surface-container' : 'bg-surface')}>
      <div className="container-page flex h-16 items-center gap-1">
        <Brand />
        <NavLinks className="ml-6 hidden md:flex" />

        <div className="ml-auto flex items-center gap-1">
          <GitHubStars className="mr-1 hidden sm:inline-flex" />
          <ThemeToggle />
          <LanguageMenu />
          <MobileMenuButton className="-mr-2 md:hidden" />
        </div>
      </div>

      <NavigationProgress />
    </header>
  );
}
