import { useState } from "react";
import { Modal, StyleProp, StyleSheet, TextStyle, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/hooks/use-theme';
import CardColorsPanel from '@/components/Settings/ui-panels/CardColorsPanel';
import SettingsPanel from '@/components/Settings/ui-panels/SettingsPanel';
import TabButton from '@/components/Settings/ui-panels/TabButton';

interface SettingsProps {
    style: StyleProp<TextStyle> | undefined,
}

export default function Settings({ style }: SettingsProps) {
  const [activeTab, setActiveTab] = useState("design");
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  return (
    <>
      <TouchableOpacity
        style={styles.settingsContainer}
        onPress={() => setIsSettingsOpen(true)}
      >
        <MaterialCommunityIcons name="dots-vertical" style={[style]} />
      </TouchableOpacity>
      <Modal visible={isSettingsOpen} transparent animationType="fade">
        <TouchableOpacity
          style={[StyleSheet.absoluteFill]}
          onPress={() => setIsSettingsOpen(false)}
          activeOpacity={1}
        />
        
        <View style={{backgroundColor: theme.bgContainer}}>
          <View style={styles.tabsContainer}>
            <TabButton style={styles.tabs}
              tabName="design"
              tabText="Card Design"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <TabButton style={styles.tabs}
              tabName="settings"
              tabText="Settings"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </View>
          {activeTab === "design" && (
            <CardColorsPanel style={{backgroundColor: theme.bgContainer}}/>
          )}
          {activeTab === "settings" && (
            <SettingsPanel />
          )}
        </View>
      </Modal>
    </>
  );
}

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
      padding:10,
      marginTop: 0,
      margin: 'auto',
	    color: theme.fontColor,
    },
  });