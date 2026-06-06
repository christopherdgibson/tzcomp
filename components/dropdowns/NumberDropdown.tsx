import { useEffect, useRef, useState } from "react";
import { Keyboard, Modal, ScrollView, StyleProp, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Typography, TypographyKey } from '@/constants/theme';

import type {OnChange} from "@/constants/types";

interface NumberDropdownProps {
  style?: StyleProp<TextStyle> | undefined,
  fontStyle?: StyleProp<TextStyle> | undefined,
  display?: (input: number) => string | number;
  defaultOption: number | null | undefined;
  min: number;
  max: number;
  onOptionSelect: OnChange<number>;
}

export default function NumberDropdown({ style, fontStyle, display = n => n, defaultOption, min, max, onOptionSelect }: NumberDropdownProps) {
  const btnRef = useRef<View>(null);
  const theme = useTheme();
  const styles = makeStyles(theme);
  const dropdownOptions: number[] = Array.from(
      { length: max - min + 1 }, 
      (_, i) => min + i
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedNumber, setSelectedNumber] = useState<number>(defaultOption ?? 0);
  const [search, setSearch] = useState("");
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (defaultOption != null) {
        setSelectedNumber(defaultOption);
    }
  }, [defaultOption]);

  // useEffect(() => {
  //   const handleKey = (e: KeyboardEvent) => {
  //       if (e.key.length === 1) setSearch(prev => prev + e.key);
  //       // if (e.key === 'Backspace') setSearch(prev => prev.slice(0, -1));
  //   };
  //   window.addEventListener("keydown", handleKey);
  //   return () => window.removeEventListener("keydown", handleKey);
  // }, [isDropdownOpen]);

  const filteredOptions = dropdownOptions.filter(option =>
    option.toString().includes(search.toLowerCase())
  );

//   const handleInputChange = (text: string, display: (input: number) => string | number = n => n) => {
  
//   let parsed = parseInt(text, 10);
//   let searchString;
//   if (parsed) {
//     searchString = display(parsed) as string;
//   } else {
//     searchString = text;

//   }
//   setSearch(searchString);

//   if (!isNaN(parsed)) {
//     setSelectedNumber(parsed);
//     onOptionSelect(searchString);
//   }
// };
//   useEffect(() => {
//     if (input != null) {
//         setSelectedNumber(input);
//     }
//   }, [input]);

  const toggleDropdown = () => {
    setSearch('');
    setIsDropdownOpen(prev => !prev);
  };



// useEffect(() => {
//   const sub = Keyboard.addListener('keyboardDidShow', (e) => {
//     const keyboardHeight = e.endCoordinates.height;
//     setDropdownPos(prev => {
//       // if dropdown would be obscured by keyboard, move it above the button instead
//       const screenHeight = e.endCoordinates.screenY;
//       if (prev.top + 200 > screenHeight - keyboardHeight) {
//         return { ...prev, top: prev.top - 200 - e.endCoordinates.height };
//       }
//       return prev;
//     });
//   });
//   return () => sub.remove();
// }, []);

  const openDropdown = () => {
    btnRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownPos({ top: y + height, left: x, width });
      toggleDropdown();
    });
  };

  const closeDropdown = () => {
    setSearch('');
    setIsDropdownOpen(false);
  };

  return (
    <View style={style}>
      <TouchableOpacity ref={btnRef}
        style={styles.dropbtn}
        onPress={openDropdown}
      >
        <View style={styles.dropbtnInner}>
           <Text style={[fontStyle]}>{display(selectedNumber)}</Text><Text style={styles.dropbtnArrow}>{isDropdownOpen ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={isDropdownOpen} transparent animationType="none">
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => closeDropdown()}
            activeOpacity={1}
          />
          <View style={[styles.dropdownContent, { top: dropdownPos.top, left: dropdownPos.left, minWidth: dropdownPos.width }]}>
            <TextInput
              style={styles.dropdownSearch}
              value={search}
              onChangeText={setSearch}
              keyboardType="numeric"
              placeholder="Search..."
              placeholderTextColor={theme.fontSubtle}
              autoFocus
            />
            {/* <ScrollView style={styles.dropdownContent}> */}
             <ScrollView>
              {filteredOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownItem}
                  onPress={() => {
                    onOptionSelect(option);
                    setSelectedNumber(option);
                    closeDropdown();
                  }}
                >
                  <Text style={styles.dropdownItemText}>{display(option)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modal>
    </View>
  );
}


const makeStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({

    // .text-dropdown
    textDropdown: {
      position: 'relative',
      borderWidth: 1,
      borderColor: theme.fontColor, 
    },
    dropdownSearch: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.bgSelected,
      color: theme.fontColor,
      fontSize: 14,
    },
    // .dropbtn
    dropbtn: {
      paddingVertical: 1,
      paddingHorizontal: 5,
      // minHeight:70,
      maxWidth: "0000".length * 25,
      // borderWidth: 1,
      // borderColor: theme.fontColor,
    },
    dropbtnInner: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignContent: 'center',
      // borderWidth: 1,
      // borderColor: theme.fontColor,
      flex: 1,
    },
    dropbtnText: {
      // ...Typography.lg,
      color: theme.fontColor,
      // fontSize: 36,
    },
    dropbtnArrow: {
      color: theme.fontColor,
      fontSize: 16,
      paddingLeft: 6,
    },
    // :hover → use onPressIn/onPressOut to toggle a pressed style
    dropbtnPressed: {
      backgroundColor: theme.bgSelected,
    },

    // .dropdown-backdrop
    dropdownBackdrop: {
      position: 'absolute',  // inside a Modal this covers the screen
      top: 0, left: 0, right: 0, bottom: 0,
      //zIndex: 9,
      elevation: 19,
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

    }

  });