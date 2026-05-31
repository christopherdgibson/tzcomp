/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// import '@/global.css';

import { Platform } from 'react-native';

import { colorMix } from '@/utils/colorUtils';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
    // text: '#ffffff',
    // background: '#000000',
    // backgroundElement: '#212225',
    // backgroundSelected: '#2E3135',
    // textSecondary: '#B0B4BA',
  },
} as const;

export const Presets = {
  default: {
      baseBg: "#e3e3e3",
      fontSelected: "#0d3ca1",
      accentPrimary: "#0000FF",
      accentSecondary: "#FFA500"
    },
    blue: {
      baseBg: "#c2ddf7",
      fontSelected: "#1a56d6",
      accentPrimary: "#1a56d6",
      accentSecondary: "#e07b20",      
    },
    forest: {
      baseBg: "#b8dfc8",
      fontSelected: "#1a6b3c",
      accentPrimary: "#1a6b3c",
      accentSecondary: "#c4962a",
    },
    plum: {
      baseBg: "#d4bfee",
      fontSelected: "#5b2d8e",
      accentPrimary: "#5b2d8e",
      accentSecondary: "#c0392b",

    },
    slate: {
      baseBg: "#b8cfe0",
      fontSelected: "#2c4a6e",
      accentPrimary: "#2c4a6e",
      accentSecondary: "#e05c3a",
    },
    custom: { baseBg: '', fontSelected: '', accentPrimary: '', accentSecondary: '' }
} as const;

export type PresetKeys = keyof typeof Presets;

export const GradientPalette = {
    default: {
      gradientLeft: "#0000ff", 
      gradientRight: "#ffa500",
      name: "Default"
    },
    blue: {
      gradientLeft: "#1a56d6", 
      gradientRight: "#e07b20",
      name: "Default"
    },
    forest: {
      gradientLeft: "#1a6b3c", 
      gradientRight: "#c4962a",
      name: "Default"
    },
    plum: {
      gradientLeft: "#5b2d8e", 
      gradientRight: "#c0392b",
      name: "Default"
    },
    slate: {
      gradientLeft: "#2c4a6e", 
      gradientRight: "#e05c3a",
      name: "Default"
    },
    purpleYellow: {
      gradientLeft: "#8c00b7", 
      gradientRight: "#fcff41",
      name: "Default"
    },
    purpleGrey: {
      gradientLeft: "#6e0edc", 
      gradientRight: "#b7b7b7",
      name: "Default"
    },
    blueRed: {
      gradientLeft: "#000097", 
      gradientRight: "#ff4747",
      name: "Default"
    },
    blueLightBlue: {
      gradientLeft: "#000097", 
      gradientRight: "#82c1f2",
      name: "Default"
    },
} as const;

export type GradientKeys = keyof typeof GradientPalette;

export function buildTheme(baseBg: string, fontSelected: string, accentPrimary: string, accentSecondary: string) {
  return {
    bgContainer:     colorMix(baseBg, '#ffffff', 80),
    bgCard:          baseBg,
    bgCardHover:     colorMix(baseBg, '#ffffff', 85),
    bgCardPart:      colorMix(baseBg, '#000000', 95),
    bgDesc:          colorMix(baseBg, '#ffffff', 88),
    bgSelected:      colorMix(baseBg, '#000000', 92),
    fontColor:       colorMix(fontSelected, '#000000', 90),
    fontSubtle:      colorMix(fontSelected, '#000000', 70),
    fontOpaque:      colorMix(fontSelected, '#ffffff', 70),

    // Gradient pairs for LinearGradient
    gradSelected:    [accentPrimary, colorMix(accentPrimary, '#ffffff', 80)] as const,
    dividerBarGrad:  [accentPrimary, accentSecondary] as const,
    bgCardGrad:      [baseBg, colorMix(baseBg, '#ffffff', 90)] as const,
    bgCardHoverGrad: [colorMix(baseBg, '#ffffff', 85), colorMix(colorMix(baseBg, '#ffffff', 85), '#ffffff', 90)] as const,

    accentPrimary,
    accentSecondary,
  };
}

// theme.ts
export const Typography = {
  sm:   { fontSize: 12 },
  base: { fontSize: 14 },
  md:   { fontSize: 16 },
  lg:   { fontSize: 30 },
  xl:   { fontSize: 38 },
} as const;

export const TextStyles = {
  body:    { fontSize: Typography.base.fontSize, color: undefined as any },
  subtle:  { fontSize: Typography.sm.fontSize,   color: undefined as any },
  heading: { fontSize: Typography.lg.fontSize,   color: undefined as any },
} as const;

export type TypographyKey = keyof typeof Typography;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
