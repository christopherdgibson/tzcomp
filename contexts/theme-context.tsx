// contexts/theme-context.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PresetKeys, Presets } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CustomColors = {
  baseBg: string;
  fontSelected: string;
  accentPrimary: string;
  accentSecondary: string;
};

const ThemeContext = createContext<{
    preset: PresetKeys;
    setPreset: (preset: PresetKeys) => void;
    customColors: CustomColors;
    setCustomColors: (colors: Partial<CustomColors>) => void;
  }>({
    preset: 'default',
    setPreset: () => {},
    customColors: Presets.custom as CustomColors,
    setCustomColors: () => {},
  });

const DEFAULT_CUSTOM: CustomColors = {
  baseBg: "#e3e3e3",
  fontSelected: "#0d3ca1",
  accentPrimary: "#0000FF",
  accentSecondary: "#FFA500"
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preset, setPresetState] = useState<PresetKeys>('blue');
  const [customColors, setCustomColorsState] = useState<CustomColors>(DEFAULT_CUSTOM);

  useEffect(() => {
    AsyncStorage.multiGet(['preset', 'customColors']).then(([p, c]) => {
      if (p[1]) setPresetState(p[1] as PresetKeys);
      if (c[1]) setCustomColorsState(JSON.parse(c[1]));
    });
  }, []);

  const setPreset = (p: PresetKeys) => {
    setPresetState(p);
    AsyncStorage.setItem('preset', p);
  };

  const setCustomColors = (colors: Partial<CustomColors>) => {
    const updated = { ...customColors, ...colors };
    setCustomColorsState(updated);
    AsyncStorage.setItem('customColors', JSON.stringify(updated));
  };

  return (
    <ThemeContext.Provider value={{ preset, setPreset, customColors, setCustomColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext);