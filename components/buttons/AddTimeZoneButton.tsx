import type { Dispatch, SetStateAction } from "react";
import { useTheme } from '@/hooks/use-theme';
import { Typography } from '@/constants/theme';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AddTimeZoneButtonProps {
    compareZones: number;
    setCompareZones: Dispatch<SetStateAction<number>>;
}

export default function AddTimeZoneButton({compareZones, setCompareZones}: AddTimeZoneButtonProps) {
    const theme = useTheme();
    const styles = makeStyles(theme);
    return (
        <View style={styles.btnThemeContainer}>
            <TouchableOpacity
                style={[styles.btnTheme, styles.btnPrimary]}
                onPress={() => {
                    setCompareZones(compareZones + 1);
                }}
            >
                <Text style={[styles.btnText, styles.primaryText]}>Add new time zone</Text>
            </TouchableOpacity>

            {compareZones > 1 && 
            <TouchableOpacity
                style={[styles.btnTheme, styles.btnSecondary]}
                onPress={() => {
                    setCompareZones(compareZones - 1);
                }}
            >
                <Text style={[styles.btnText, styles.secondaryText]}>Remove time zone</Text>
            </TouchableOpacity>
            }
        </View>
    )
}

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    
    btnThemeContainer: {
      flexDirection: 'row',
      gap: 10,
    },

    btnTheme: {
        borderWidth: 1,
		borderRadius: 2,
		cursor: 'pointer',
        borderColor: theme.fontColor,
        alignItems: 'center',
        alignContent: 'center'
    },
    btnText: {
        ...Typography.base,
        paddingVertical: 12,
        paddingHorizontal: 6,
    },
    btnPrimary: {
        backgroundColor: theme.fontColor,
    },
    primaryText: {
        color: 'white',
    },
    btnSecondary: {
		backgroundColor: 'none',
    },
    secondaryText: {
        color: theme.fontColor,
    },
  });