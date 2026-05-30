import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import { Colors, darkColors, lightColors } from '../theme/theme';

const THEME_KEY = 'silver_theme_preference';

export type ThemeScheme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  colors: Colors;
  isDark: boolean;
  scheme: ThemeScheme;
  setScheme: (s: ThemeScheme) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  colors: lightColors,
  isDark: false,
  scheme: 'system',
  setScheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [scheme, setSchemeState] = useState<ThemeScheme>('system');

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setSchemeState(stored);
      }
    });
  }, []);

  const setScheme = useCallback((s: ThemeScheme) => {
    setSchemeState(s);
    AsyncStorage.setItem(THEME_KEY, s);
  }, []);

  const isDark = scheme === 'system' ? systemScheme === 'dark' : scheme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ colors, isDark, scheme, setScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
