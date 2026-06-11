import { StatusBar } from 'expo-status-bar';
import { Platform , ScrollView, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
// import { SafeAreaView } from 'react-native-safe-area-context';
import {ThemeProvider} from '@/contexts/theme-context';
import {SettingsProvider} from '@/contexts/settings-context';
import TimeZoneApp from "@/components/TimeZoneApp";
import timeZoneData from "@/constants/time-zone-names.json";
const timeZoneNames = timeZoneData.timeZoneNames;
import { useTheme } from '@/hooks/use-theme';

export default function App() {
      const theme = useTheme();
      const styles = makeStyles(theme);
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
        <ScrollView style={styles.cardContainer}>
          <View style={styles.container}>
            <TimeZoneApp timeZoneNames={timeZoneNames} />
            <StatusBar style="auto" />
          </View>
        </ScrollView>
      </ThemeProvider>
    </SettingsProvider>
  );
}
const makeStyles = (theme: ReturnType<typeof useTheme>) =>
StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: theme.bgContainer,
      alignItems: 'center',
      width: Platform.OS === 'web' ? undefined : '100%',
      maxWidth: Platform.OS === 'web' ? 480 : undefined,
      alignSelf: 'center',
  },
  cardContainer: {
    position: 'relative',
    width: '100%',
    backgroundColor: theme.bgContainer,
    marginTop: 0,
    margin: 'auto',
    color: theme.fontColor,
  },
});
