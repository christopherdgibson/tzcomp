import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
import {ThemeProvider} from '@/contexts/theme-context';
import {SettingsProvider} from '@/contexts/settings-context';
import TimeZoneApp from "@/components/TimeZoneApp";
import timeZoneData from "@/constants/time-zone-names.json";
const timeZoneNames = timeZoneData.timeZoneNames;

export default function App() {
  return (
    <>
    {/* <SafeAreaView>
          </SafeAreaView> */}
      <SettingsProvider>
        <ThemeProvider>
          <View style={styles.container}>
            <TimeZoneApp timeZoneNames={timeZoneNames} />
            <StatusBar style="auto" />
          </View>
        </ThemeProvider>
      </SettingsProvider>
</>
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
