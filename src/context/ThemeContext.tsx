import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type SidebarColor = 'blue' | 'cyan' | 'indigo' | 'violet' | 'rose' | 'emerald' | 'slate';

type ThemeContextType = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarColor: SidebarColor;
  setSidebarColor: React.Dispatch<React.SetStateAction<SidebarColor>>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });
  const [sidebarColor, setSidebarColor] = useState<SidebarColor>('blue');

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    } catch {}
  }, [darkMode]);

  const value = useMemo(() => ({ darkMode, setDarkMode, sidebarColor, setSidebarColor }), [darkMode, sidebarColor]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}; 