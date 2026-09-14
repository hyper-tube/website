import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { resolveTheme, revealTheme, themeCookie } from '~/lib/theme';
import type { Theme, ThemePreference } from '~/lib/theme.shared';

interface ThemeContextValue {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  toggleTheme: (origin?: { x: number; y: number }) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyPreference(preference: ThemePreference): void {
  document.documentElement.dataset.theme = preference;
}

export function ThemeProvider({
  initialPreference,
  children,
}: PropsWithChildren<{ initialPreference: ThemePreference }>) {
  const [preference, setPreferenceState] = useState(initialPreference);

  useEffect(() => {
    applyPreference(preference);
  }, [preference]);

  const setPreference = useCallback((next: ThemePreference) => {
    applyPreference(next);
    setPreferenceState(next);

    themeCookie.set(next, { secure: window.location.protocol === 'https:' });
  }, []);

  const toggleTheme = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: Theme = resolveTheme(preference) === 'dark' ? 'light' : 'dark';

      revealTheme(() => setPreference(next), origin);
    },
    [preference, setPreference],
  );

  const value = useMemo(
    () => ({ preference, setPreference, toggleTheme }),
    [preference, setPreference, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
}
