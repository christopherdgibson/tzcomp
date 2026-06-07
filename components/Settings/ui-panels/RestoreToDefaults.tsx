import { useState } from "react";
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Typography } from '@/constants/theme';
import { useThemeContext } from '@/contexts/theme-context';

interface RestoreToDefaultsProps {
    style?: StyleProp<TextStyle> | undefined,
}

export default function RestoreToDefaults({style}: RestoreToDefaultsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { preset, setPreset } = useThemeContext();
  const theme = useTheme();
  const styles = makeStyles(theme);
  const isDefault = preset === 'default';

  return (
    <View style={[styles.btnGrid]}>
      <TouchableOpacity
        onPress={() => {
          if (isDefault) return;
          setIsModalOpen(true);
        }
      }
        style={[styles.btnDefault, isDefault ? styles.btnNull : styles.btnPrimary]}
      >
        {isDefault
          ? <Text style={[styles.btnText, styles.btnSecondaryText]}>Defaults currently set</Text>
          : <Text style={[styles.btnText, styles.btnPrimaryText]}>Restore to defaults</Text>
        }
      </TouchableOpacity>
      {isModalOpen &&
        <View style={styles.confirm}>
          <Text style={styles.modalText}>Are you sure you want to restore the default colors?</Text>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={() => {
                setPreset('default');
                setIsModalOpen(false);
              }}
              style={[style, styles.btnDefault, styles.btnPrimary]}
            >
              <Text style={[styles.btnText, styles.btnPrimaryText]}>Yes, restore</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsModalOpen(false);
              }}
              style={[style, styles.btnDefault, styles.btnSecondary]}
            >
              <Text style={[styles.btnText, styles.btnSecondaryText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    </View>
  );
}

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    modal: {
      top: '50%',
      backgroundColor: theme.backgroundSelected,
      padding: 10,
    },
    confirm: {
      padding: 10,
    },
    modalText: {
      ...Typography.sm,
    },
    btnContainer: {
      flexDirection: 'row',
      gap: 10,
      padding: 10,
    },
    btnGrid: {
    // marginTop: "1em", textAlign: "center" }
      flexDirection: "row",
      gap: 10,
      alignItems: "baseline",
      justifyContent: "space-evenly",
      marginTop: 1,
      padding: 20,
      backgroundColor: theme.bgContainer,
      flexWrap: 'wrap',
    },
    btnDefault: {
      borderWidth: 1,
      borderRadius: 0,
      minWidth: 90,
      cursor: 'pointer',
      alignItems: 'center',
      alignContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      padding: 6,
      flex: 1,
    },
    btnPrimary: {
      backgroundColor: theme.accentPrimary,
      borderColor: theme.accentPrimary,
      // backgroundColor: '#007cba',
      // borderColor: '#007cba',
      color: '#fff',
    },
    btnSecondary: {
      backgroundColor: 'transparent',
      borderColor: theme.fontColor,
    },
    btnNull: {
      backgroundColor: theme.backgroundSelected,
      // backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    btnText: {
      ...Typography.md,
      paddingVertical: 12,
      paddingHorizontal: 6,
    },
    btnPrimaryText: {
      color: '#fff',
    },
    btnSecondaryText: {
      color: theme.fontColor,
    },
    btnThemeContainer: {
      flexDirection: 'row',
      gap: 10,
    },
  }
);
