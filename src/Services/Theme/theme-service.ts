const THEME_KEY = 'JIC.THEME';

export type ThemeT = 'dark' | 'light';

export function storeTheme(theme: ThemeT): void {
  localStorage.setItem(THEME_KEY, theme);
}

export function getTheme(): ThemeT {
  let theme = localStorage.getItem(THEME_KEY) as ThemeT | null;
  if (theme === null) {
    // generate default theme
    theme = 'light';
    if (window && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'dark';
    }
  }
  return theme;
}

export function deleteTheme(): void {
  localStorage.removeItem(THEME_KEY);
}
