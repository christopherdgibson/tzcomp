import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
// import { SafeAreaView } from 'react-native-safe-area-context';
import {ThemeProvider} from '@/contexts/theme-context';
import {SettingsProvider} from '@/contexts/settings-context';
import TimeZoneApp from "@/components/TimeZoneApp";
import timeZoneData from "@/constants/time-zone-names.json";
const timeZoneNames = timeZoneData.timeZoneNames;

import WebDemoBanner from "@/components/WebDemoBanner";

export default function App() {
    const [fontsLoaded] = useFonts({
    'AvenirLTStdLight': require('./assets/fonts/AvenirLTStdLight.otf'),
    'AvenirLTStdBook': require('./assets/fonts/AvenirLTStdBook.otf'),
    'AvenirLTStdHeavy': require('./assets/fonts/AvenirLTStdHeavy.otf'),
  });

  if (!fontsLoaded) return null; // or a splash / loading screen
  return (
    // <SafeAreaView>
    //       </SafeAreaView>
    <SettingsProvider>
      <ThemeProvider>
        <View style={styles.pageBackground}>
          <View style={[styles.container, styles.phoneFrame]}>
            <WebDemoBanner/>
            <TimeZoneApp timeZoneNames={timeZoneNames} />
            <StatusBar style="auto" />
          </View>
        </View>
      </ThemeProvider>
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 'auto',
    width: Platform.OS === 'web' ? undefined : '100%',
    maxWidth: Platform.OS === 'web' ? 480 : undefined,
  },
  // Web-only wrapper styles
  phoneFrame: {
    ...Platform.select({
      web: {
        borderRadius: 40,
        borderWidth: 10,
        borderColor: '#222',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.4,
        shadowRadius: 40,
        maxWidth: 390,
        alignSelf: 'center',
        marginVertical: 40,
      } as any,
    })
  },
  pageBackground: {
    ...Platform.select({
      web: {
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#0f0f0f',
      } as any,
    })
  }
});