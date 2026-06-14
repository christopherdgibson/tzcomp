import { useEffect, useMemo, useState } from "react";
import { Modal, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View } from 'react-native';
import { ColorPicker } from 'react-native-color-picker';
// import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider, returnedResults } from "reanimated-color-picker";
import { useTheme } from '@/hooks/use-theme';
import { PresetKeys, Presets } from '@/constants/theme';
import {toPascalCase} from '@/utils/timezoneUtils';

import SimpleColorPicker from '@/components/Settings/ui-panels/CustomColorPicker';

import { useThemeContext } from '@/contexts/theme-context';


import TabButton from "@/components/Settings/ui-panels/TabButton";
// import GradientColorsPanel from "@components/Settings/ui-panels/GradientColorsPanel";
interface CardColorsPanelProps {
  style?: StyleProp<TextStyle> | undefined,
}

export default function CustomColorsPanel({ style }: CardColorsPanelProps) {
  const { customColors, setCustomColors } = useThemeContext();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [activeSubTab, setActiveSubTab] = useState<string>("background");

  const colorMap = {
    background: 'baseBg',
    text: 'fontSelected',
    gradient: 'accentPrimary',
  } as const;

  const currentColor = customColors[colorMap[activeSubTab as keyof typeof colorMap]];
  const onSelectColor = (hex: string ) => {
    "worklet";
    setCustomColors({ [colorMap[activeSubTab as keyof typeof colorMap]]: hex })
    // do something with the selected color.
    console.log(hex);
  };
  return (
    <View style={style}>
      <View style={styles.tabsContainer}>
        <TabButton style={styles.tabs}
          tabName="background"
          tabText="Background"
          activeTab={activeSubTab}
          setActiveTab={setActiveSubTab}
        />
        <TabButton style={styles.tabs}
          tabName="text"
          tabText="Text"
          activeTab={activeSubTab}
          setActiveTab={setActiveSubTab}
        />
        <TabButton style={styles.tabs}
          tabName="gradient"
          tabText="Gradient"
          activeTab={activeSubTab}
          setActiveTab={setActiveSubTab}
        />
      </View>

{/* <SimpleColorPicker color={currentColor} onColorChange={onSelectColor}/> */}
 {/* <ColorPicker style={{ width: "70%" }} value={currentColor} onComplete={onSelectColor}>
          <Preview />
          <Panel1 />
          <HueSlider />
          <OpacitySlider />
          <Swatches />
        </ColorPicker> */}
      <ColorPicker
        defaultColor={currentColor}
        onColorSelected={(color: string) =>
          setCustomColors({ [colorMap[activeSubTab as keyof typeof colorMap]]: color })
        }
        style={{ width: 250, height: 250 }}
      />
    </View>
  );
}

// interface CustomColorPickerProps {
//   activeSubTab: string;
// }

// function CustomColorPicker({activeSubTab}: CustomColorPickerProps) {
//    const { customColors, setCustomColors } = useThemeContext();
//   const [showModal, setShowModal] = useState(false);
    
//   const colorMap = {
//     background: 'baseBg',
//     text: 'fontSelected',
//     gradient: 'accentPrimary',  // primary gradient color
//   } as const;

//   const currentColor = customColors[colorMap[activeSubTab as keyof typeof colorMap]];


//   // Note: use `onCompleteJS` and `onChangeJS` for non-worklet functions
//   const onSelectColor = (hex: returnedResults ) => {
//     "worklet";
//     setCustomColors({ [colorMap[activeSubTab as keyof typeof colorMap]]: hex })
//     // do something with the selected color.
//     console.log(hex);
//   };

//   return (
//     <View >
//         <ColorPicker style={{ width: "70%" }} value="red" onComplete={onSelectColor}>
//           <Preview />
//           <Panel1 />
//           <HueSlider />
//           <OpacitySlider />
//           <Swatches />
//         </ColorPicker>
//     </View>
//   );
// }

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    tabs: {
      flex: 1,
    },
    settingsContainer: {
      position: 'relative',
      width: '100%',
      backgroundColor: theme.backgroundSelected,
      marginTop: 0,
      margin: 'auto',
	color: theme.fontColor,
    },
    settingsInnerContainer: {
        margin: 0,
        padding: 0,
        gap: 10,
        marginHorizontal: 20,
        paddingVertical: 40,
    },
    btnGrid: {
        flexDirection: "row",
        gap: 10,
        alignItems: "baseline",
        justifyContent: "space-evenly",
        marginTop: 1,
        padding: 20,
        backgroundColor: theme.bgContainer,
        flexWrap: 'wrap',
    },
    btnThemeText: {
        paddingVertical: 12,
        paddingHorizontal: 6,
    },
    btnThemeColor: {
        borderRadius: 2,
		fontSize: 13,
        minWidth:90,
		cursor: 'pointer',
        backgroundColor: theme.fontColor,
		color: '#fff',
        alignItems: 'center',
        alignContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        padding: 6,
    },
  });