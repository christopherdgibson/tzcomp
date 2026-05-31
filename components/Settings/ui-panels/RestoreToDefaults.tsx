import { useEffect, useState } from "react";
import { Modal, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { PresetKeys, Presets, Typography } from '@/constants/theme';
import { useThemeContext } from '@/contexts/theme-context';

import {toPascalCase} from '@/utils/timezoneUtils';

interface RestoreToDefaultsProps {
    style?: StyleProp<TextStyle> | undefined,
}

export default function RestoreToDefaults({style}: RestoreToDefaultsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { preset, setPreset } = useThemeContext();
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={[styles.btnGrid]}>
      <TouchableOpacity
        onPress={() => setIsModalOpen(true)}
        style={[styles.btnDefault, styles.btnPrimary]}
      >
          <Text style={[styles.btnText, styles.btnPrimaryText]}>Restore to defaults</Text>
      </TouchableOpacity>

      <Modal visible={isModalOpen} transparent animationType="fade">
        <TouchableOpacity
          style={[StyleSheet.absoluteFill]}
          onPress={() => setIsModalOpen(false)}
          activeOpacity={1}
        />
          <View style={styles.modal}>
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
                style={[style, styles.btnDefault]}
              >
                <Text style={[styles.btnText, styles.btnSecondaryText]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
      </Modal>
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
    modalText: {

      fontSize: 12,
      // ...Typography.md,
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
      fontSize: 13,
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
      backgroundColor: '#007cba',
      borderColor: '#007cba',
      color: '#fff',
    },
    btnSecondary: {
      backgroundColor: 'transparent',
      borderColor: theme.fontColor,
    },
    btnText: {
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
