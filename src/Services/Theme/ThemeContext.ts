import React from 'react';
import { ThemeT } from './theme-service';

export interface ThemeContextI {
  theme: ThemeT;
  setTheme: (theme: ThemeT) => void;
}

export const ThemeContext = React.createContext<ThemeContextI>({
  theme: 'dark',
  setTheme: () => {}
});
