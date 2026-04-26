'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolved: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  setTheme: () => undefined,
  resolved: 'dark',
});

export function useTheme() {
  return useContext(ThemeContext);
}

const STORAGE_KEY = 'ebenezer-theme';

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    /* ignore */
  }
  return 'system';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', theme);
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolved, setResolved] = useState<'light' | 'dark'>('dark');

  // Initialise from localStorage on mount — runs once client-side
  useEffect(() => {
    const stored = getStoredTheme();
    setThemeState(stored);
    applyTheme(stored);

    // Track system preference for 'resolved' value
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => {
      const effectiveTheme = stored === 'system' ? (mq.matches ? 'dark' : 'light') : stored;
      setResolved(effectiveTheme);
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When theme changes after init, keep resolved in sync
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const effective = theme === 'system' ? (mq.matches ? 'dark' : 'light') : theme;
    setResolved(effective);
  }, [theme]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
}
