export type ThemeMode = 'light' | 'dark';

export type ThemeTransitionState = {
  isAnimating: boolean;
  theme: ThemeMode;
  isDarkMode: boolean;
};
