import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'pampulha_theme';

export const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
  } catch {
    // Caso de ambiente com storage restrito
  }
  return 'dark';
};

export const applyThemeToDocument = (theme: Theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useTheme = (initialTheme?: Theme) => {
  const [theme, setTheme] = useState<Theme>(() => initialTheme ?? getStoredTheme());

  // Aplica classe ao elemento documentElement
  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  // Escuta alterações na preferência do sistema operacional caso o usuário não tenha fixado manualmente
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return;
    } catch {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme: Theme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    } else if ('addListener' in mediaQuery) {
      (mediaQuery as any).addListener(handleChange);
      return () => {
        (mediaQuery as any).removeListener(handleChange);
      };
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Ignora erro em storage restrito
      }
      return next;
    });
  }, []);

  const setManualTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // Ignora erro em storage restrito
    }
  }, []);

  return {
    theme,
    setTheme: setManualTheme,
    toggleTheme,
    isDark: theme === 'dark',
  };
};
