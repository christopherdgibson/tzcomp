import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { PresetKeys, Presets } from '@/constants/theme';
import { useThemeContext } from '@/contexts/theme-context';

import {toPascalCase} from '@/utils/timezoneUtils';

export default function PresetColorsPanel() {
  const { preset, setPreset } = useThemeContext();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const ACCENTS = Object.keys(Presets) as PresetKeys[];
  const avoidKeys = 'default' as PresetKeys;

  return (
    <View style={styles.btnGrid}>
        {ACCENTS.map(accent => (
            accent !== 'default' && accent !== 'custom' &&
        <TouchableOpacity
            key={accent}
            onPress={() => setPreset(accent)}
            style={[styles.btnThemeColor, {backgroundColor: Presets[accent].baseBg, borderWidth: 2,
                borderColor:  preset === accent ? theme.fontColor : 'transparent',}]}
        >
            <Text style={[styles.btnThemeText, {color:Presets[accent].accentSecondary}]}>{toPascalCase(accent)}</Text>
        </TouchableOpacity>
        )
        )}
    </View>
  );
}

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({

    settingsContainer: {
      position: 'relative',
      width: '100%',
      backgroundColor: theme.backgroundSelected,
      marginTop: 0,
      margin: 'auto',
	color: theme.fontColor,
    },
    settingsInnerContainer: {
        margin: 0,
        padding: 0,
        gap: 10,
        marginHorizontal: 20,
        paddingVertical: 40,
    },
    btnGrid: {
        flexDirection: "row",
        gap: 10,
        alignItems: "baseline",
        justifyContent: "space-evenly",
        marginTop: 1,
        padding: 20,
        backgroundColor: theme.bgContainer,
        flexWrap: 'wrap',
    },
    btnThemeText: {
        fontWeight: 500,
        paddingVertical: 12,
        paddingHorizontal: 6,
    },
    btnThemeColor: {
        borderRadius: 2,
		fontSize: 13,
        minWidth:90,
        width: '40%',
		cursor: 'pointer',
        backgroundColor: theme.fontColor,
		color: '#fff',
        alignItems: 'center',
        alignContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        padding: 6,
    },
  });