import { useEffect, useRef, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

import type {OnChange} from "@/constants/types";
import {zoneClean} from "@/utils/timezoneUtils";

import {colorMix} from "@/utils/colorUtils";

// import "./styles.css";

interface DropdownProps {
  defaultOption?: string | null;
  dropdownOptions: string[];
  onOptionSelect: OnChange<string>;
}

export default function TimeZoneDropdown({ defaultOption, dropdownOptions, onOptionSelect }: DropdownProps): React.JSX.Element {
  const btnRef = useRef<View>(null);
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedZone, setSelectedZone] = useState<string>(defaultOption ? zoneClean(defaultOption) : "Select time zone");
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (defaultOption != null) {
        setSelectedZone(zoneClean(defaultOption));
        setIsLoading(false);
    }
  }, [defaultOption]);

  // useEffect(() => {
  //     const handleKey = (e: KeyboardEvent) => {
  //         if (e.key.length === 1) setSearch(prev => prev + e.key);
  //         // if (e.key === 'Backspace') setSearch(prev => prev.slice(0, -1));
  //     };
  //     window.addEventListener("keydown", handleKey);
  //     return () => window.removeEventListener("keydown", handleKey);
  // }, [isDropdownOpen]);

  const filteredOptions = dropdownOptions.filter(option =>
      option.toLowerCase().includes(search.toLowerCase())
  );

  const toggleDropdown = () => {
    setSearch('');
    setIsDropdownOpen(prev => !prev);
  };

  const openDropdown = () => {
    btnRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownPos({ top: y + height, left: x, width });
      toggleDropdown();
    });
  };

  const closeDropdown = () => {
    setSearch('');
    toggleDropdown();
  };

  return (
    <View style={styles.textDropdown}>
      <TouchableOpacity ref={btnRef} style={styles.dropbtn} onPress={openDropdown}>
        <View style={styles.dropbtnInner}>
          <Text style={styles.dropbtnText}>{selectedZone}</Text>
          <Text style={styles.dropbtnArrow}>{isDropdownOpen ? '▲' : '▼'}</Text>
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
            placeholder="Search..."
            placeholderTextColor={theme.fontSubtle}
            autoFocus
          />
          <ScrollView>
            {filteredOptions.map((zone) => (
              <TouchableOpacity
                key={zone}
                style={styles.dropdownItem}
                onPress={() => {
                  onOptionSelect(zone);
                  setSelectedZone(zoneClean(zone));
                  closeDropdown();
                }}
              >
                <Text style={styles.dropdownItemText}>{zoneClean(zone)}</Text>
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
      // borderBottomWidth: 1,
      // borderBottomColor: theme.bgSelected,
      color: theme.fontColor,
      fontSize: 14,
    },
    // .dropbtn
    dropbtn: {
      position: 'relative',
      paddingVertical: 1,
      paddingHorizontal: 5,
      // borderWidth: 1,
      // borderColor: theme.fontColor, 
      gap:10,
      zIndex: 1,
      height: 30,
    },
    dropbtnInner: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap:10,
      flex: 1,
    },
    dropbtnText: {
      color: theme.fontColor,
      fontSize: 14,
    },
    dropbtnArrow: {
      color: theme.fontColor,
      fontSize: 10,
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
      maxHeight: 500,
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

    }

  });