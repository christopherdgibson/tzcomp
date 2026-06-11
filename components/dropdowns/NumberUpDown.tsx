import { useEffect, useState } from "react";
import { Platform, StyleProp, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

import type {OnChange} from "@/constants/types";

interface NumberDropdownUpDownProps {
  style?: StyleProp<TextStyle> | undefined,
  fontStyle?: StyleProp<TextStyle> | undefined,
  display?: (input: number) => string | number;
  input: number | null | undefined;
  onChange: OnChange<number>;
}

export default function NumberUpDown({ style, fontStyle, input, display = n => n, onChange }: NumberDropdownUpDownProps): React.JSX.Element {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [selectedNumber, setSelectedNumber] = useState<number>(input ?? 0);
  const [inputValue, setInputValue] = useState(display(selectedNumber).toString());

  // keep inputValue in sync if selectedNumber changes externally (e.g. arrow buttons)
  useEffect(() => {
    setInputValue(display(selectedNumber).toString());
  }, [selectedNumber]);

  const handleInputChange = (text: string) => {
    setInputValue(text);
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed)) {
      setSelectedNumber(parsed);
      onChange(parsed);
    }
  };
  
  useEffect(() => {
    if (input != null) {
        setSelectedNumber(input);
    }
  }, [input]);

  return (
    <View style={[style, styles.numberUpDown]}>
      <TextInput
        style={[fontStyle, styles.textInput]}
        value={inputValue}
        onChangeText={handleInputChange}
        keyboardType="numeric"
        placeholderTextColor={theme.fontColor}
      />
      <View style={styles.numberArrowContainer}>
        <TouchableOpacity
          onPress={() => {
            onChange(selectedNumber + 1);
            setSelectedNumber(selectedNumber + 1);
          }}
        >
          <Text style={styles.upDownArrow}>
            {'▲'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onChange(selectedNumber - 1);
            setSelectedNumber(selectedNumber - 1);
          }}
        >
          <Text style={styles.upDownArrow}>
            {'▼'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    numberUpDown: {
      flexDirection: 'row',
      paddingLeft: 5,
      alignContent: 'center',
      alignItems: 'center',
    },
    textInput: {
      ...Platform.select({
          web: {
            minWidth: 100,
            width: 0,
            flexGrow: 1,
          } as any,
      })
    },
    upDownArrow: {
      color: theme.fontColor,
      fontSize: 16,
    },
    numberArrowContainer: {
      flexDirection: 'column',
      paddingHorizontal: 6,
      justifyContent: 'center',
      alignSelf: 'center',
    },
  });