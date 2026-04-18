import { createContext, useContext } from 'react';
import { Theme as ThemeType } from '../styles/getTheme';

export const ThemeContext = createContext<ThemeType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
