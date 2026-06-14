import { memo, ReactNode, useMemo } from 'react';
import { Platform, StyleProp, StyleSheet, Switch, Text, TextStyle, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { useSettings } from '@/contexts/settings-context';
import CustomSwitch from '@/components/Settings/ui-buttons/CustomSwitch';

export default memo(SettingsPanel);

function SettingsPanel({ style }: { style?: StyleProp<TextStyle> | undefined, }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { settings, setSetting } = useSettings();

  interface SettingsRowProps {
    label: string,
    children: ReactNode,
    style?: StyleProp<TextStyle> | undefined
  }

  function SettingsRow({ label, children, style }: SettingsRowProps) {
    const theme = useTheme();
    const styles = makeStyles(theme);
    return (
      <View style={[styles.settingsRow, style]}>
        <Text style={styles.settingsLabel}>{label}</Text>
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.settingsPanel, style]}>
      <SettingsRow label="24-hour time">
        {Platform.OS === 'web' ?
          <CustomSwitch value={settings.use24Hour}
            onValueChange={(v) => setSetting('use24Hour', v)}
            theme={theme} />
          :
          <Switch
            value={settings.use24Hour}
            onValueChange={(v) => setSetting('use24Hour', v)}
            thumbColor={theme.accentPrimary}
            trackColor={{ false: theme.bgSelected, true: theme.accentSecondary }}
          />
        }
      </SettingsRow>

      <SettingsRow label="Show seconds">
        {Platform.OS === 'web' ?
          <CustomSwitch value={settings.showSeconds}
            onValueChange={(v) => setSetting('showSeconds', v)}
            theme={theme} />
            :
          <Switch
            value={settings.showSeconds}
            onValueChange={(v) => setSetting('showSeconds', v)}
            thumbColor={theme.accentPrimary}
            trackColor={{ false: theme.bgSelected, true: theme.accentSecondary }}
          />
        }
      </SettingsRow>

      <SettingsRow style={{paddingVertical: 20}} label="Date format">
          <View style={styles.segmentedControl}>
            {(['DMY', 'MDY'] as const).map(fmt => (
              <TouchableOpacity
                key={fmt}
                style={[styles.segment, settings.dateFormat === fmt && styles.segmentActive]}
                onPress={() => setSetting('dateFormat', fmt)}
              >
                <Text style={[styles.segmentText, settings.dateFormat === fmt && styles.segmentTextActive]}>
                  {fmt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
      </SettingsRow>
    </View>
  );
}

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    settingsPanel: {
    //gap: 16,
    //paddingVertical: 18,
    paddingHorizontal: 10,
    },
    settingsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.bgSelected,
    },
    settingsLabel: {
      fontSize: 14,
      color: theme.fontColor,
    },
    segmentedControl: {
      flexDirection: 'row',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.accentPrimary,
      overflow: 'hidden',
    },
    segment: {
      paddingVertical: 4,
      paddingHorizontal: 10,
    },
    segmentActive: {
      backgroundColor: theme.accentPrimary,
    },
    segmentText: {
      fontSize: 12,
      color: theme.accentPrimary,
    },
    segmentTextActive: {
      color: '#fff',
    },
  });