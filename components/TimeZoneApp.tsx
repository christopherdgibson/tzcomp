import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import TimeZoneCard from "@/components/cards/TimeZoneCard";
import Settings from "@/components/Settings";

import AddTimeZoneButton from "@/components/buttons/AddTimeZoneButton";
import FooterCopyright from "@/components/FooterCopyright";
import { Typography } from "@/constants/theme";

interface TimeZoneAppProps {
    timeZoneNames: string[];
}

export default function TimeZoneApp({ timeZoneNames }: TimeZoneAppProps) {
    const theme = useTheme();
    const styles = makeStyles(theme);
    const [time, setTime] = useState<Date>(new Date());
    const [overrideTime, setOverrideTime] = useState<Date | null>(null);
    const [compareZones, setCompareZones] = useState<number>(2);

    // IANA timezone string (e.g. "Europe/Brussels")
    const currentTimeZoneIANA = Intl.DateTimeFormat().resolvedOptions().timeZone;

    useEffect(() => {
    if (overrideTime === null) {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    } else {
        setTime(overrideTime);
    }
    }, [overrideTime]);

    return (
        <ScrollView style={styles.cardContainer}>
            <View style={styles.cardInnerContainer}>
                <View style={styles.localTimeHeader}>
                    <Text style={[styles.localTimeTitle, styles.titleText]}>Time zones</Text>
                    <View style={styles.svgIcon}>
                      <Settings style={styles.localTimeTitle}/>
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
        paddingVertical: 40,
    },
    localTimeHeader: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: "space-between",
      width: '100%',
      // paddingHorizontal: 10,
    },
    localTimeTitle: {
      ...Typography.lg,
      fontWeight: 500,
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
  });