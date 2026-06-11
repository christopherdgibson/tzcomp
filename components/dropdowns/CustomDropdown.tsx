import { useEffect, useRef, useState } from "react";
import { Dimensions } from 'react-native';
import { Keyboard, Modal, ScrollView, StyleProp, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import {KeyboardTypeOptions} from "react-native";

import type {OnChange} from "@/constants/types";

interface CustomDropdownProps<T extends string | number> {
    style?: StyleProp<TextStyle>;
    fontStyle?: StyleProp<TextStyle>;
    display?: (input: T) => string;
    keyboardType?: KeyboardTypeOptions;
    defaultOption: T | null | undefined;
    inputOptions?: T[];
    min?: number;
    max?: number;
    onOptionSelect: OnChange<T>;
}

interface DropdownPositionProperties {
  top: number | undefined;
  bottom: number | undefined;
  left: number;
  width: number;
  height: number;
}

export default function CustomDropdown<T extends string | number>({ style, fontStyle, display = n => n.toString(), keyboardType, defaultOption, inputOptions = [], min, max, onOptionSelect }: CustomDropdownProps<T>) {
  const btnRef = useRef<View>(null);
  const theme = useTheme();
  const styles = makeStyles(theme);

  const dropdownOptions: T[] = (min !== undefined && max !== undefined)
    ? Array.from({ length: max - min + 1 }, (_, i) => (min + i) as T)
    : (inputOptions as T[]);

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedNumber, setSelectedNumber] = useState<T>(defaultOption ?? (min ?? 0) as T);
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
        setSelectedNumber(defaultOption as T);
    }
  }, [defaultOption]);

  const filteredOptions = dropdownOptions.filter(option =>
    option.toString().toLowerCase().includes(search.toLowerCase())
    || display(option).toString().toLowerCase().includes(search.toLowerCase())
  );

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
        let dropdownHeight = prev.height;
        if (opensUpwardRef.current && prev.top !== undefined) {
          let bottom = windowMeasurementsRef.current.spaceBelow + windowMeasurementsRef.current.height - keyboardHeight;
          if (bottom < 0) {
            dropdownHeight = Math.min(prev.height, screenHeight - 50);
            bottom = 0;
          }
          return { ...prev, top: undefined, bottom: bottom, height: dropdownHeight};
        } else if (prev.top !== undefined) {
          if (prev.top + prev.height > screenHeight) {
            dropdownHeight = windowMeasurementsRef.current.screenHeight - keyboardHeight - prev.top - 10;
          }
          return {...prev, height: dropdownHeight};
        }
        return prev;
      });
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      if (searchRef.current === '' || !opensUpwardRef.current) {
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

      if (spaceAbove > spaceBelow - height) {
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
    <View style={[style, isDropdownOpen ? styles.dropbtnPressed : null]}>
      <TouchableOpacity ref={btnRef}
        style={styles.dropbtn}
        onPress={openDropdown}
      >
        <View style={styles.dropbtnInner}>
           <Text style={[fontStyle]}>{display(selectedNumber as T)}</Text><Text style={styles.dropbtnArrow}>{isDropdownOpen ? '▲' : '▼'}</Text>
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
                    setSelectedNumber(option as T);
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
      zIndex: 1,
      elevation: 1,
    },
    dropdownSearch: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      color: theme.fontColor,
      fontSize: 14,
    },
    dropbtn: {
      position: 'relative',
      paddingVertical: 1,
      paddingHorizontal: 5,
      minHeight: 30,
    },
    dropbtnInner: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 6,
      flex: 1,
    },
    dropbtnArrow: {
      color: theme.fontColor,
      fontSize: 16,
    },
    dropbtnPressed: {
      backgroundColor: theme.bgSelected,
    },
    dropdownBackdrop: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 10,
      elevation: 10,
    },
    dropdownContent: {
      position: 'absolute',
      top: '100%',
      left: 0,
      zIndex: 10,
      minWidth: 200,
      backgroundColor: theme.bgCard,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 10,
    },
    dropdownItem: {
      color: theme.text,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    dropdownItemPressed: {
      backgroundColor: theme.bgSelected,
    },
    dropdownItemText: {
      color: theme.fontColor,
    }
  });
  