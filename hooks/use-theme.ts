/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { buildTheme, Presets, PresetKeys, Typography, TypographyKey } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeContext } from '@/contexts/theme-context';

// export function useTheme(accent: AccentKey = 'default', typography: TypographyKey='base') {
//   const scheme = useColorScheme();
//   const base = Colors[scheme == null ? 'light' : scheme];
//   return { ...base, ...Accents[accent], ...Typography[typography] };
// }

export function useTheme() {
  const { preset, customColors } = useThemeContext();
  const scheme = useColorScheme();
  const base = Colors[scheme == null ? 'light' : scheme];
  const palette = preset === 'custom' ? customColors : Presets[preset];
  return { ...base, ...buildTheme(palette.baseBg, palette.fontSelected, palette.accentPrimary, palette.accentSecondary) };
}
