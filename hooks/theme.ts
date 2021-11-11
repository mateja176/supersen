import { useTheme as useEmotionTheme } from '@emotion/react';
import { Theme } from '../utils/theme';

const useTheme = (): Theme => {
  const theme = useEmotionTheme();
  return theme as Theme;
};

export default useTheme;
