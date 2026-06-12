import { useEffect, useRef, useState } from "react";
import { Platform, ScrollView, StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import TimeZoneCard from "@/components/cards/TimeZoneCard";
import SettingsButton from "@/components/Settings/SettingsButton";

import WebDemoBanner from "@/components/WebDemoBanner";
import AddTimeZoneButton from "@/components/buttons/AddTimeZoneButton";
import FooterCopyright from "@/components/FooterCopyright";
import { Typography } from "@/constants/theme";

interface TimeZoneAppProps {
    style?: StyleProp<TextStyle> | undefined,
    timeZoneNames: string[];
}

export default function TimeZoneApp({ style, timeZoneNames }: TimeZoneAppProps) {
    const theme = useTheme();
    const styles = makeStyles(theme);
    const [time, setTime] = useState<Date>(new Date());
    const [overrideTime, setOverrideTime] = useState<Date | null>(null);
    const [compareZones, setCompareZones] = useState<number>(2);

    // Current IANA timezone string (e.g. "Europe/Brussels")
    const currentTimeZoneIANA = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const bannerRef = useRef<View>(null);
    const [bannerLayout, setBannerLayout] = useState({ top: 150, left: 0, width: 390 });
    const settingsPosition = Platform.OS === 'web' ? bannerLayout : undefined;

    useEffect(() => {
    if (overrideTime === null) {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    } else {
        setTime(overrideTime);
    }
    }, [overrideTime]);

    return (
        <>
            <View ref={bannerRef} onLayout={() => {
                if (Platform.OS === 'web') {
                    bannerRef.current?.measureInWindow((x, y, width, height) => {
                        setBannerLayout({ top: y + height, left: x, width });
                    });
                }
            }}>
                <WebDemoBanner/>
            </View>
            <ScrollView style={[style, styles.cardContainer]}>
                <View style={styles.cardInnerContainer}>
                    <View style={styles.localTimeHeader}>
                        <Text style={[styles.localTimeTitle, styles.titleText]}>Time zones</Text>
                        <View style={styles.svgIcon}>
                        <SettingsButton iconStyle={styles.localTimeTitle} modalPosition={settingsPosition} modalStyle={styles.settingsPanel}/>
                        </View>
                    </View>
                    <View style={styles.cardColumn}>
                        {Array.from({ length: compareZones }, (_, i) => (
                        <TimeZoneCard key={i} timeZoneNames={timeZoneNames} time={time} overrideTime={overrideTime} setOverrideTime={setOverrideTime} timeZoneDefault={i===0 ? currentTimeZoneIANA : null} />
                        ))
                        }
                    </View>
                    <AddTimeZoneButton compareZones={compareZones} setCompareZones={setCompareZones}/>
                    <FooterCopyright />
                </View>
            </ScrollView>
        </>
    );
}

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    cardContainer: {
      position: 'relative',
      width: '100%',
      backgroundColor: theme.bgContainer,
      marginTop: 0,
      margin: 'auto',
      color: theme.fontColor,
    },
    cardInnerContainer: {
      backgroundColor: theme.bgContainer,
        margin: 0,
        padding: 0,
        gap: 10,
        marginHorizontal: 20,
        paddingVertical: Platform.OS === 'web' ? 10 : 40,
    },
    localTimeHeader: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: "space-between",
      width: '100%',
    },
    localTimeTitle: {
      ...Typography.lgBook,
      textTransform: 'uppercase',
      color: theme.fontColor,
    },
    titleText: {
      flexWrap: "wrap",
      flex: 1,
    },
    cardColumn: {
        gap:10,
    },
    svgIcon: {
        //width: 90,
    },
    settingsPanel: {
      backgroundColor: theme.bgContainer,
    },
  });