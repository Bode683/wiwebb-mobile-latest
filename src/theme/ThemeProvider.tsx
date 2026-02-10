import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from './colors';
import type { ColorScheme, ThemeColors } from './colors';
import { mmkvStorage } from '../mmkv';

const THEME_KEY = 'app-color-scheme';

interface ThemeContextValue {
  colorScheme: ColorScheme;
  theme: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme() as ColorScheme | null;

  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    const saved = mmkvStorage.getString(THEME_KEY) as ColorScheme | undefined;
    return saved ?? systemScheme ?? 'light';
  });

  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const setColorScheme = (scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    mmkvStorage.set(THEME_KEY, scheme);
  };

  const toggleTheme = () => {
    setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, theme, isDark, toggleTheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
