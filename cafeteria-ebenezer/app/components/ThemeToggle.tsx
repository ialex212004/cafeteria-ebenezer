'use client';

import { useTheme } from './ThemeProvider';

/** Sun icon for light mode */
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

/** Moon icon for dark mode */
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
  );
}

/** Auto icon (half-sun, half-moon) for system preference */
function AutoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h9" fill="currentColor" opacity="0.2" stroke="none" />
      <path d="M12 3a9 9 0 0 0 0 18V3z" fill="currentColor" opacity="0.15" stroke="none" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

type Theme = 'light' | 'dark' | 'system';

const CYCLE: Theme[] = ['system', 'light', 'dark'];

const LABELS: Record<Theme, string> = {
  system: 'Auto',
  light: 'Claro',
  dark: 'Oscuro',
};

const ICONS: Record<Theme, React.ReactNode> = {
  system: <AutoIcon />,
  light: <SunIcon />,
  dark: <MoonIcon />,
};

const NEXT_LABELS: Record<Theme, string> = {
  system: 'Cambiar a modo claro',
  light: 'Cambiar a modo oscuro',
  dark: 'Cambiar a modo automático',
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const currentIndex = CYCLE.indexOf(theme);
    const nextIndex = (currentIndex + 1) % CYCLE.length;
    setTheme(CYCLE[nextIndex]);
  };

  return (
    <button
      className="theme-toggle"
      onClick={cycleTheme}
      aria-label={NEXT_LABELS[theme]}
      title={NEXT_LABELS[theme]}
    >
      {ICONS[theme]}
      <span>{LABELS[theme]}</span>
    </button>
  );
}
