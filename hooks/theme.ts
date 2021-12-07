import create from 'zustand';
import theme, { Theme } from '../utils/theme';

export interface ThemeStore {
  theme: Theme;
  setTheme: (partialTheme: Partial<Theme>) => void;
}
const useTheme = create<ThemeStore>((set) => ({
  theme,
  setTheme: (partialTheme) =>
    set((currentTheme) => ({ ...currentTheme, ...partialTheme })),
}));

export default useTheme;
