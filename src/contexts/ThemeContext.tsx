import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { ThemeName } from '@/types';

const THEME_COLORS: Record<ThemeName, Record<string, string>> = {
  warm: {
    '--bg': '#FFF8F0',
    '--card': '#FFFFFF',
    '--accent': '#F5E6D3',
    '--primary': '#E8927C',
    '--primary-light': '#F2C4B8',
    '--secondary': '#C49A6C',
    '--text': '#6B5E52',
    '--text-muted': '#A3968A',
    '--border': '#F5E6D3',
  },
  forest: {
    '--bg': '#F4F7F2',
    '--card': '#FFFFFF',
    '--accent': '#D4E3D0',
    '--primary': '#7BA07A',
    '--primary-light': '#A8C8A6',
    '--secondary': '#6B8F6B',
    '--text': '#4A5C4A',
    '--text-muted': '#8A9A8A',
    '--border': '#D4E3D0',
  },
  ocean: {
    '--bg': '#F2F6FA',
    '--card': '#FFFFFF',
    '--accent': '#D0E0F0',
    '--primary': '#6B9BC4',
    '--primary-light': '#A3C5E0',
    '--secondary': '#5A85A8',
    '--text': '#4A5C6E',
    '--text-muted': '#8A9AA8',
    '--border': '#D0E0F0',
  },
  starry: {
    '--bg': '#F5F4FA',
    '--card': '#FFFFFF',
    '--accent': '#E0DDF0',
    '--primary': '#9B8EC4',
    '--primary-light': '#C4BCE0',
    '--secondary': '#7B6EA8',
    '--text': '#5A4E6E',
    '--text-muted': '#9A8EA8',
    '--border': '#E0DDF0',
  },
};

interface ThemeState {
  theme: ThemeName;
  bgImage: string | null;
  setTheme: (theme: ThemeName) => void;
  setBgImage: (image: string | null) => void;
}

const ThemeContext = createContext<ThemeState | undefined>(undefined);

function applyTheme(theme: ThemeName) {
  const colors = THEME_COLORS[theme];
  const root = document.documentElement;
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

function applyBgImage(image: string | null) {
  if (image) {
    document.body.style.backgroundImage = `url(${image})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundPosition = 'center';
  } else {
    document.body.style.backgroundImage = '';
    document.body.style.backgroundSize = '';
    document.body.style.backgroundAttachment = '';
    document.body.style.backgroundPosition = '';
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    return (localStorage.getItem('sunny-theme') as ThemeName) || 'warm';
  });
  const [bgImage, setBgImageState] = useState<string | null>(() => {
    return localStorage.getItem('sunny-bg-image');
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    applyBgImage(bgImage);
  }, [bgImage]);

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem('sunny-theme', t);
  };

  const setBgImage = (img: string | null) => {
    setBgImageState(img);
    if (img) localStorage.setItem('sunny-bg-image', img);
    else localStorage.removeItem('sunny-bg-image');
  };

  return (
    <ThemeContext.Provider value={{ theme, bgImage, setTheme, setBgImage }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}