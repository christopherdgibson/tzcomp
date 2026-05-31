import { useEffect, useState } from "react";
import { StyleProp, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

import { Typography } from '@/constants/theme';

import type {OnChange} from "@/constants/types";

// import "./styles.css";


interface NumberDropdownUpDownProps {
  style: StyleProp<TextStyle> | undefined,
  display?: (input: number) => string | number;
  input: number | null | undefined;
  onChange: OnChange<number>;
}

export default function NumberUpDown({ style, input, display = n => n, onChange }: NumberDropdownUpDownProps): React.JSX.Element {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [search, setSearch] = useState("");
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

  // useEffect(() => {
  //   const handleKey = (e: KeyboardEvent) => {
  //       if (e.key.length === 1) {
  //         setSearch(prev => prev + e.key);
  //         setSelectedNumber(Number(selectedNumber.toString() + e.key));
  //       }
  //       // if (e.key === 'Backspace') setSearch(prev => prev.slice(0, -1));
  //   };
  //   window.addEventListener("keydown", handleKey);
  //   return () => window.removeEventListener("keydown", handleKey);
  // }, [selectedNumber]);

  return (
    <View style={style}>
      <TextInput
          // style={[styles.dropbtnText, { width: "2022".length * 25}]}
          style={styles.dropbtnText}
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
          <Text style={styles.dropbtnArrow}>
            {'▲'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
                onPress={() => {
                  onChange(selectedNumber - 1);
                  setSelectedNumber(selectedNumber - 1);
                }}
              >
          <Text style={styles.dropbtnArrow}>
            {'▼'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const makeStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    // numberUpDown: {
    //   position: 'relative',
    //   flexDirection: 'row',
    //   borderWidth: 1,
    //   borderColor: theme.fontColor, 
    //   paddingLeft: 5,
    //   alignItems: 'center',
    //   fontSize: 4,
    // },
    dropbtn: {
      paddingVertical: 0,
      paddingHorizontal: 5,
      borderWidth: 1,
      borderColor: theme.fontColor,
      height:10,
    },
    dropbtnText: {
      color: theme.fontColor,
      ...Typography.lg,
      flex: 0,
      
    },
    dropbtnArrow: {
      color: theme.fontColor,
      fontSize: 16,
      paddingVertical: 0,
    },
    // :hover → use onPressIn/onPressOut to toggle a pressed style
    dropbtnPressed: {
      backgroundColor: theme.bgSelected,
    },

    // .dropdown-backdrop
    dropdownBackdrop: {
      position: 'absolute',  // inside a Modal this covers the screen
      top: 0, left: 0, right: 0, bottom: 0,
      // zIndex: 9,
    },
    dropdownContent: {
      position: 'absolute',
      top: '100%',        // appears just below the button
      left: 0,
      // zIndex: 10,
      minWidth: 200,
      maxHeight: 500,
      backgroundColor: theme.bgCard,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 10,
    },
    // .dropdown-content li
    dropdownItem: {
      color: theme.text,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    // :hover equivalent
    dropdownItemPressed: {
      backgroundColor: theme.bgSelected,
    },
    dropdownItemText: {

    },
    numberArrowContainer: {
      flexDirection: 'column',
      paddingHorizontal: 6,
      
    }

  });