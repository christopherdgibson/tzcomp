import { useEffect, useRef, useState } from "react";
import { Dimensions } from 'react-native';
import { Keyboard, Modal, ScrollView, StyleProp, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { KeyboardTypeOptions } from "react-native";

import type {OnChange} from "@/constants/types";

interface NumberDropdownProps {
  style?: StyleProp<TextStyle> | undefined,
  fontStyle?: StyleProp<TextStyle> | undefined,
  display?: (input: number) => string | number;
  keyboardType?: KeyboardTypeOptions;
  defaultOption: number | null | undefined;
  min: number;
  max: number;
  onOptionSelect: OnChange<number>;
}

export default function NumberDropdown({ style, fontStyle, display = n => n, keyboardType, defaultOption, min, max, onOptionSelect }: NumberDropdownProps) {
  const btnRef = useRef<View>(null);
  const theme = useTheme();
  const styles = makeStyles(theme);
  const dropdownOptions: number[] = Array.from(
    { length: max - min + 1 }, 
    (_, i) => min + i
  );

  interface DropdownPositionProperties {
    top: number | undefined;
    bottom: number | undefined;
    left: number;
    width: number;
    height: number;
  }

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedNumber, setSelectedNumber] = useState<number>(defaultOption ?? 0);
  const [search, setSearch] = useState("");
  const [dropdownPos, setDropdownPos] = useState<DropdownPositionProperties>({ top: 0, bottom: 0, left: 0, width: 0, height: 0 });
  const [windowMeasurements, setWindowMeasurements] = useState({ x: 0, y: 0, width: 0, height: 0, spaceBelow: 0, spaceAbove: 0, screenHeight: 0 });
  const [opensUpward, setOpensUpward] = useState(false);

  const searchRef = useRef<string>(search);
  const windowMeasurementsRef = useRef(windowMeasurements);
  const originalPos = useRef<typeof dropdownPos | null>(null);
  const opensUpwardRef = useRef<boolean>(false);
  const maxHeight = 500;

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
    option.toString().toLowerCase().includes(search.toLowerCase())
    || display(option).toString().toLowerCase().includes(search.toLowerCase())
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
    setSearchInput('');
    setIsDropdownOpen(prev => !prev);
  };

  function setSearchInput(input: string) {
    setSearch(input);
    searchRef.current = input;
  }

  // Adjust dropdown size and position if obscured by keyboard
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      const keyboardHeight = e.endCoordinates.height;
      const screenHeight = e.endCoordinates.screenY;

      setDropdownPos(prev => {
        let height = prev.height;
        if (opensUpwardRef.current && prev.top !== undefined) {
          let bottom = windowMeasurementsRef.current.spaceBelow + windowMeasurementsRef.current.height - keyboardHeight;
          if (bottom < 0) {
            height = Math.min(prev.height, screenHeight - 50);
            bottom = 0;
          }
          return { ...prev, top: undefined, bottom: bottom, height: height};
        } else if (prev.top !== undefined) {
          if (prev.top + prev.height > screenHeight) {
            height = prev.height - keyboardHeight + 40;
          }
          return {...prev, height: height};
        }
        return prev;
      });
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      if (searchRef.current ==='' || !opensUpwardRef.current) {
        setDropdownPos(prev => originalPos.current ?? prev);
      } else {
        setDropdownPos({...originalPos.current, top: undefined,
          bottom: windowMeasurementsRef.current.spaceBelow + windowMeasurementsRef.current.height
          } as DropdownPositionProperties);
      }
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const openDropdown = () => {
    const screenHeight = Dimensions.get('window').height;
    btnRef.current?.measureInWindow((x, y, width, height) => {
      const spaceBelow = screenHeight - (y + height);
      const spaceAbove = y;

      const measurements = {x, y, width, height, spaceBelow, spaceAbove, screenHeight};
      setWindowMeasurements(measurements);
      windowMeasurementsRef.current = measurements;
      let position;

      if (spaceAbove > spaceBelow) {
        setOpensUpward(true);
        opensUpwardRef.current = true;
        const menuHeight = Math.min(spaceAbove - 50, maxHeight);
        position = { bottom: undefined, left: x, width, top: y - menuHeight, height: menuHeight };
      } else {
        setOpensUpward(false);
        opensUpwardRef.current = false;
        position = { top: y + height, left: x, width, bottom: undefined, height: Math.min(spaceBelow - 50, maxHeight) };
      }
      originalPos.current = position;  // store before any keyboard adjustment
      setDropdownPos(position);
      toggleDropdown();
    });
  };

  const modalPosition = { top: dropdownPos.top, bottom: dropdownPos.bottom,
    left: dropdownPos.left, minWidth: dropdownPos.width, maxHeight: dropdownPos.height };
    
  const closeDropdown = () => {
      setSearchInput('');
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
          <View style={[styles.dropdownContent, modalPosition, opensUpward && { flexDirection: 'column-reverse' }]}>
            <TextInput
              style={styles.dropdownSearch}
              value={search}
              onChangeText={setSearchInput}
              keyboardType={keyboardType}
              placeholder="Search..."
              placeholderTextColor={theme.fontSubtle}
              autoFocus={false}
            />
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
    textDropdown: {
      position: 'relative',
      borderWidth: 1,
      borderColor: theme.fontColor, 
    },
    dropdownSearch: {
      height: 40,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.bgSelected,
      color: theme.fontColor,
      fontSize: 14,
    },
    dropbtn: {
      paddingVertical: 1,
      paddingHorizontal: 5,
      // minHeight:70,
      maxWidth: "0000".length * 25,
    },
    dropbtnInner: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignContent: 'center',
      flex: 1,
    },
    dropbtnText: {
      // ...Typography.lg,
      color: theme.fontColor,
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
      minWidth: 200,
      //maxHeight: 500,
      backgroundColor: theme.bgCard,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 10,
    },
    dropdownItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    // :hover equivalent
    dropdownItemPressed: {
      backgroundColor: theme.bgSelected,
    },
    dropdownItemText: {
      color: theme.fontColor,
    }
  });