import { useMemo } from 'react';
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/use-theme';
import { Presets, GradientPalette, GradientKeys } from '@/constants/theme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useThemeContext } from '@/contexts/theme-context';


interface GradientColorPanelProps {
  style?: StyleProp<TextStyle> | undefined,
}

export default function GradientColorPanel({ style }: GradientColorPanelProps) {
  const { preset, setPreset, customColors, setCustomColors } = useThemeContext();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const GRADIENTS = Object.keys(GradientPalette) as GradientKeys[];

  const setGradient = (gradient: string ) => {
    if (preset !== 'custom') {
      const currentPalette =  Presets[preset];
      setCustomColors({
        ...currentPalette,
        ["accentPrimary"]: GradientPalette[gradient as GradientKeys].gradientLeft,
        ["accentSecondary"]: GradientPalette[gradient as GradientKeys].gradientRight
      });
      setPreset('custom');
    } else {
      setCustomColors({
        ["accentPrimary"]: GradientPalette[gradient as GradientKeys].gradientLeft,
        ["accentSecondary"]: GradientPalette[gradient as GradientKeys].gradientRight
      });
    }
  };

  return (
    <View style={[style, styles.btnGrid]}>
        {GRADIENTS.map(gradient => (
          <LinearGradient
            key={gradient}
            colors={[GradientPalette[gradient].gradientLeft, GradientPalette[gradient].gradientRight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cardWrapper}
          >         
            <TouchableOpacity
                onPress={() => setGradient(gradient)}
                style={[styles.btnGradient, styles.gradCard 
                  ]}
            >
              <View style={styles.iconsTop}>
                {/* <MaterialCommunityIcons name="wave" style={[styles.textIcon, {flex:1}]} color={theme.fontColor}/> */}
                <LinearGradient
                  colors={[GradientPalette[gradient].gradientLeft, GradientPalette[gradient].gradientRight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.accentLine, styles.accentLineTop]}
                  // style={{height: 2, width: 20, borderRadius: 2, marginTop: 10, marginBottom: 10}}
              />
              <MaterialCommunityIcons name="timetable" style={[styles.textIcon]} color={theme.fontColor}/>
              </View>
              <LinearGradient
                  colors={[GradientPalette[gradient].gradientLeft, GradientPalette[gradient].gradientRight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.accentLine, styles.accentLineBottom]}
              />
            </TouchableOpacity>
          </LinearGradient>
        ))}
    </View>
  );
}

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    cardWrapper: {
      padding: 1,
      borderRadius: 2,
      margin:0,
    },
    gradCard: {
      backgroundColor: theme.bgCard,
      borderRadius: 2,
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
    accentLine: {
      height: 2,
      borderRadius: 2,
      marginTop: 10,
      marginBottom: 10,
    },
    accentLineTop: {
      width: 20,
    },
    accentLineBottom: {
      width: '100%',
    },
    textIcon: {
      fontSize: 15,
    },
    textIconHide: {
      fontSize: 15,
      color: theme.bgCard,
    },
    btnGradient: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      paddingHorizontal: 15,
      fontSize: 13,
      minWidth:90,
      cursor: 'pointer',
      color: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      padding: 6,
    },
    iconsTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignSelf: 'stretch',
    },
  });