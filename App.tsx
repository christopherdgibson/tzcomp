import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
// import { SafeAreaView } from 'react-native-safe-area-context';
import {ThemeProvider} from '@/contexts/theme-context';
import {SettingsProvider} from '@/contexts/settings-context';
import TimeZoneApp from "@/components/TimeZoneApp";
import timeZoneData from "@/constants/time-zone-names.json";
const timeZoneNames = timeZoneData.timeZoneNames;

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
          <View style={styles.container}>
            <TimeZoneApp timeZoneNames={timeZoneNames} />
            <StatusBar style="auto" />
          </View>
        </ThemeProvider>
      </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
