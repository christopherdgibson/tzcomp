import type { Dispatch, SetStateAction } from "react";
import { useTheme } from '@/hooks/use-theme';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AddTimeZoneButtonProps {
    compareZones: number;
    setCompareZones: Dispatch<SetStateAction<number>>;
}

// import type { CompareZoneProps } from "@block-root/types";
// function addTimeZone(compareZones: CompareZoneProps[] | null, timeZone: string = "", difference: number = 0): CompareZoneProps[] {
//   let newCompareZones: CompareZoneProps[];
//   if (compareZones == null) {
//     newCompareZones = [{timeZone: timeZone, difference: difference}]
//   } else {
//     newCompareZones = [...compareZones,
//         {timeZone: timeZone, difference: difference}
//     ];
//   }
//   return newCompareZones;
// }
// function addTimeZone(compareZones: CompareZoneProps[]): CompareZoneProps[] {
//     return [
//         ...compareZones,
//         {timeZone: "", difference: 0}
//     ];
// }


export default function AddTimeZoneButton({compareZones, setCompareZones}: AddTimeZoneButtonProps) {
    const theme = useTheme();
    const styles = makeStyles(theme);
    return (
        <View style={styles.btnThemeContainer}>
            <TouchableOpacity
                style={styles.btnThemePrimary}
                onPress={() => {
                    setCompareZones(compareZones + 1);
                }}
            >
                <Text style={styles.primaryText}>Add new time zone</Text>
            </TouchableOpacity>

            {compareZones > 1 && 
            <TouchableOpacity
                style={styles.btnThemeSecondary}
                onPress={() => {
                    setCompareZones(compareZones - 1);
                }}
            >
                <Text style={styles.secondaryText}>Remove time zone</Text>
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

    btnThemePrimary: {
		borderRadius: 2,
		fontSize: 13,
		cursor: 'pointer',
        backgroundColor: theme.fontColor,
		color: '#fff',
        alignItems: 'center',
        alignContent: 'center'
    },
    primaryText: {
        color: 'white',
        paddingVertical: 12,
        paddingHorizontal: 6,
    },
    btnThemeSecondary: {
		borderWidth: 1,
        borderColor: theme.fontColor,
		borderRadius: 2,
		fontSize: 13,
		cursor: 'pointer',
		color: theme.fontColor,
        alignItems: 'center',
        alignContent: 'center',
    },
    secondaryText: {
        color: theme.fontColor,
        paddingVertical: 12,
        paddingHorizontal: 6,
    },
	
   

  });