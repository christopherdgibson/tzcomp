import { useContext } from 'react';
import { SettingsContext } from '@/contexts/settings-context';

export type DateFormat = 'DMY' | 'MDY';
export type FirstDayOfWeek = 'Monday' | 'Sunday';

export type Settings = {
  use24Hour: boolean;
  showSeconds: boolean;
  dateFormat: DateFormat;
  dateLong: boolean;
  // firstDayOfWeek: FirstDayOfWeek;
};
export const DEFAULT_SETTINGS: Settings = {
  use24Hour: true,
  showSeconds: true,
  dateFormat: 'DMY',
  dateLong: true,
  // firstDayOfWeek: 'Monday',
};


export const useSettings = () => useContext(SettingsContext);