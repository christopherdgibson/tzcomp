import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings, DEFAULT_SETTINGS } from '@/hooks/use-settings';

export const SettingsContext = createContext<{
  settings: Settings;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}>({ settings: DEFAULT_SETTINGS, setSetting: () => {} });

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  useEffect(() => {
    AsyncStorage.getItem('settings').then((c) => {
      if (c) setSettings(JSON.parse(c));
    });
  }, []);
  const setSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    AsyncStorage.setItem('settings', JSON.stringify(updated));
  };
  return (
    <SettingsContext.Provider value={{ settings, setSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}