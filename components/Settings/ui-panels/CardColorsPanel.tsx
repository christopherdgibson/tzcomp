import { useState } from "react";
import { StyleProp, StyleSheet, TextStyle, View } from 'react-native';

import TabButton from "@/components/Settings/ui-panels/TabButton";
import PresetColorsPanel from "@/components/Settings/ui-panels/PresetColorsPanel";
//import CustomColorsPanel from '@/components/Settings/ui-panels/CustomColorsPanel';
import GradientColorPanel from '@/components/Settings/ui-panels/GradientColorPanel';
import RestoreToDefaults from '@/components/Settings/ui-panels/RestoreToDefaults';

interface CardColorsPanelProps {
  style: StyleProp<TextStyle> | undefined,
}

export default function CardColorsPanel({style}: CardColorsPanelProps) { 
  const [activeTab, setActiveTab] = useState("presets");
  return (
    <View style={[style]}>
      <View style={styles.tabsContainer}>
        <TabButton style={styles.tabs}
          tabName="presets"
          tabText="Presets"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton style={styles.tabs}
          tabName="gradient"
          tabText="Gradient"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton style={styles.tabs}
          tabName="defaults"
          tabText="Defaults"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </View>
      {activeTab === "presets" && (
        <PresetColorsPanel />
      )}
       {activeTab === "gradient" && (
        <GradientColorPanel />
      )}
      {activeTab === "defaults" && (
        <RestoreToDefaults />
      )}
    </View>
  );
}

const styles=StyleSheet.create({
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    tabs: {
      flex: 1,
    }
  });