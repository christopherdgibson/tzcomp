import Slider from '@react-native-community/slider';
import { useEffect, useState } from "react";
import { Modal, StyleProp, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View } from 'react-native';
//import { ColorPicker } from 'react-native-color-picker';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider, returnedResults } from "reanimated-color-picker";
import { useTheme } from '@/hooks/use-theme';
import { PresetKeys, Presets } from '@/constants/theme';
import {toPascalCase} from '@/utils/timezoneUtils';

import { useThemeContext } from '@/contexts/theme-context';


export default function CustomColorPicker({ color, onColorChange }: { color: string, onColorChange: (color: string) => void }) {
  const [hex, setHex] = useState(color);
  
  return (
    <View>
        <Slider/>
      <TextInput
        value={hex}
        onChangeText={(text) => {
          setHex(text);
          if (text.match(/^#[0-9A-Fa-f]{6}$/)) {
            onColorChange(text);
          }
        }}
        placeholder="#000000"
      />
      <View style={{ width: 40, height: 40, borderRadius: 4, backgroundColor: hex }} />
    </View>
  );
}