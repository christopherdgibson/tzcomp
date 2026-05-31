import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import type { Dispatch, SetStateAction } from "react";
import type { OnChange } from '@/constants/types';

import { useTheme } from '@/hooks/use-theme';
import { useSettings } from '@/contexts/settings-context';
import { Typography } from '@/constants/theme';

import TimeZoneDropdown from "@/components/dropdowns/TimeZoneDropdown";
import NumberDropdown from "@/components/dropdowns/NumberDropdown";
import NumberUpDown from "@/components/dropdowns/NumberUpDown";
import {GradientIcon} from "@/components/GradientIcon";
import {getHours12h, getMonthShort, padTimeDigits} from "@/utils/timezoneUtils";

interface TimeZoneLocalsProps {
  timeZoneName: string;
  localTime: Date;
  timeFullDate: string;
  timeDate: number;
  timeMonth: number;
  timeYear: number;
  timeDow: string;
  timeHours: number;
  timeMinutes: number;
  timeSeconds: number;
  timeZoneShort: string;
  timeZoneLong: string
}

interface TimeZoneCardProps {
    timeZoneNames: string[];
    time: Date;
    overrideTime: Date | null;
    setOverrideTime: Dispatch<SetStateAction<Date | null>>;
    timeZoneDefault?: string | null;
}

interface CompareZoneProps {
  timeZone?: string;
  difference: number;
}

export default function TimeZoneCard({timeZoneNames, time, overrideTime, setOverrideTime, timeZoneDefault}: TimeZoneCardProps) {
    const {settings} = useSettings();
    const theme = useTheme();
    const styles = makeStyles(theme);
    const [compareZone, setCompareZone] = useState<CompareZoneProps | null>({timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, difference: 0});
    const [apiError, setApiError] = useState<string | null>(null);
    const [isTimeSelectOpen, setIsTimeSelectOpen] = useState<boolean>(false);
    const timeZoneLocals = refreshTimeZoneLocals(compareZone?.timeZone, compareZone?.difference);

    useEffect(() => {
        if (timeZoneDefault == null) {
            console.log("useEffect timeZone: ", timeZoneDefault);
            console.log("useEffect settings.use24Hour: ", settings.use24Hour);
            handleZoneSelect("GMT");
        }
    }, []);

    async function handleZoneSelect(timeZone: string | null | undefined) {
        if (timeZone == null) return;
        setApiError(null);
        
        try {
            const utcOffset = getTimezoneOffset(timeZone);
            console.log('utcOffset:', utcOffset, 'for timezone:', timeZone);
            if (isNaN(utcOffset)) {
            setApiError("Invalid timezone offset");
            return;
            }
            const difference = utcOffset + time.getTimezoneOffset();
            setCompareZone({ timeZone, difference });
        } catch (e) {
            setApiError("Invalid timezone: " + e);
        }
    }
    
    function getTimezoneOffset(timeZone: string, date: Date = new Date()): number {
        try {
            // Get UTC time parts
            // const utcFormatter = new Intl.DateTimeFormat('en-US', {
            // timeZone: 'UTC',
            // year: 'numeric', month: 'numeric', day: 'numeric',
            // hour: 'numeric', minute: 'numeric', second: 'numeric',
            // hour12: false
            // });
            
            // Get target timezone time parts
            // const tzFormatter = new Intl.DateTimeFormat('en-US', {
            // timeZone,
            // year: 'numeric', month: 'numeric', day: 'numeric',
            // hour: 'numeric', minute: 'numeric', second: 'numeric',
            // hour12: false
            // });

            // const utcParts = Object.fromEntries(
            // utcFormatter.formatToParts(date)
            //     .filter(p => p.type !== 'literal')
            //     .map(p => [p.type, parseInt(p.value)])
            // );
            // const tzParts = Object.fromEntries(
            // tzFormatter.formatToParts(date)
            //     .filter(p => p.type !== 'literal')
            //     .map(p => [p.type, parseInt(p.value)])
            // );

            const utcParts = timeZoneParts(date, 'UTC', true);
            const tzParts = timeZoneParts(date, timeZone, true);

            const utcMs = Date.UTC(utcParts.year, utcParts.month - 1, utcParts.day, utcParts.hour, utcParts.minute, utcParts.second);
            const tzMs = Date.UTC(tzParts.year, tzParts.month - 1, tzParts.day, tzParts.hour, tzParts.minute, tzParts.second);

            return (tzMs - utcMs) / 60000;
        } catch (e) {
            console.error('getTimezoneOffset failed for:', timeZone, e);
            return 0;
        }
    }

    function timeZoneParts(date: Date, timeZone: string, use24hour: boolean) {
        const tzFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: !use24hour
        });

        return Object.fromEntries(
            tzFormatter.formatToParts(date)
                .filter(p => p.type !== 'literal')
                .map(p => [p.type, parseInt(p.value)])
            );
    }

    function getDaysInMonth(time: Date): number {
        const firstDate = new Date(time.getFullYear(), time.getMonth(), 1);
        const lastDate = new Date(time.getFullYear(), time.getMonth() + 1, 0);
        return lastDate.getDate() - firstDate.getDate() + 1;
    }

    function refreshTimeZoneLocals(timeZone: string | null | undefined, difference: number | null | undefined): TimeZoneLocalsProps | undefined {
        if (timeZone == null || difference == null) return;
        const localTime = new Date((overrideTime ?? time).getTime() + difference * 60000);
        //setCompareTime(new Date(time.getTime() + difference * 60000));
        if (localTime == null) return;
        return {
            timeZoneName: timeZone,
            localTime: localTime,
            timeFullDate: localTime.toLocaleString("default", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }),
            timeDate: localTime.getDate(),
            timeMonth: localTime.getMonth(),
            timeYear: localTime.getFullYear(),
            timeDow: localTime.toLocaleString("default", { weekday: "long" }),
            timeHours: localTime.getHours(),
            timeMinutes: localTime.getMinutes(),
            timeSeconds: localTime.getSeconds(),
            timeZoneShort: timeZone
                ? new Intl.DateTimeFormat("default", {
                    timeZoneName: "short",
                    timeZone: timeZone,
                    })
                    .formatToParts(time)
                    .find((p) => p.type === "timeZoneName")?.value
                : null,
            timeZoneLong: timeZone
                ? new Intl.DateTimeFormat("default", {
                    timeZoneName: "long",
                    timeZone: timeZone,
                    })
            .formatToParts(time)
            .find((p) => p.type === "timeZoneName")?.value
                : null
        } as TimeZoneLocalsProps;
    }

    return (
        <>
        <LinearGradient
            colors={theme.dividerBarGrad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cardWrapper}
            >
            <View style={styles.localTimeCardContainer}>
                <View style={styles.cardWrapper}>
                    <View style={styles.clockCard}>
                        <View style={styles.header}>
                            <View style={styles.clockIana}>
                                <TimeZoneDropdown
                                    defaultOption={timeZoneLocals?.timeZoneName}
                                    dropdownOptions={timeZoneNames}
                                    onOptionSelect={(timeZone: string) => handleZoneSelect(timeZone)}
                                />
                            </View>
                            {/* <LinearGradient
                                colors={theme.dividerBarGrad}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.svgIcon}
                            >
                                <Ionicons name="globe-outline" size={24} color={theme.dividerBarGrad} />
                            </LinearGradient> */}
                            <MaterialCommunityIcons name="timetable"  style={styles.textIcon} colors={theme.dividerBarGrad}/>
                            {/* <GradientIcon/> */}
                           
                        </View>
                        {/* <View style={styles.accentLine}></View> */}
                            <LinearGradient
                                colors={theme.dividerBarGrad}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.accentLine}
                            />
                        <Text style={styles.clockDow}>
                            {timeZoneLocals?.timeDow}
                        </Text>
                        <View style={styles.clockDate}>
                            {/* Put day first if DMY setting */}
                            {settings.dateFormat === "DMY" && (
                                <NumberDropdown
                                    style={styles.textDropdown}
                                    defaultOption={timeZoneLocals?.timeDate}
                                    display={padTimeDigits}
                                    min={1}
                                    max={getDaysInMonth(timeZoneLocals?.localTime ?? time)}
                                    onOptionSelect={
                                        (day) => {
                                            const adjustment = (compareZone?.difference ?? 0) * 60000;
                                            setOverrideTime(new Date(new Date(timeZoneLocals?.localTime ?? time).setDate(day) - adjustment));
                                        }
                                    }
                                />
                            )}
                            <NumberDropdown style={styles.textDropdown}
                                defaultOption={timeZoneLocals?.timeMonth}
                                display={getMonthShort}
                                min={0}
                                max={11}
                                onOptionSelect={
                                    (month) => { 
                                        const adjustment = (compareZone?.difference ?? 0) * 60000;
                                        setOverrideTime(new Date(new Date(timeZoneLocals?.localTime ?? time).setMonth(month) - adjustment));
                                    }
                                }
                            />
                            {/* Put day second if not DMY setting */}
                            {settings.dateFormat !== "DMY" && (
                                <NumberDropdown
                                    style={styles.textDropdown}
                                    defaultOption={timeZoneLocals?.timeDate}
                                    display={padTimeDigits}
                                    min={1}
                                    max={getDaysInMonth(timeZoneLocals?.localTime ?? time)}
                                    onOptionSelect={
                                        (day) => {
                                            const adjustment = (compareZone?.difference ?? 0) * 60000;
                                            setOverrideTime(new Date(new Date(timeZoneLocals?.localTime ?? time).setDate(day) - adjustment));
                                        }
                                    }
                                />
                            )}
                            <NumberUpDown 
                                style={styles.numberUpDown}
                                input={timeZoneLocals?.timeYear} onChange={
                                    (year) => { 
                                        const adjustment = (compareZone?.difference ?? 0) * 60000;
                                        setOverrideTime(new Date(new Date(timeZoneLocals?.localTime ?? time).setFullYear(year) - adjustment));
                                    }
                                }
                            />
                        </View>
                        <LinearGradient
                            colors={theme.dividerBarGrad}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.accentLine}
                        />
                        <View style={styles.clockTime}>
                            <Text style={styles.clockDigits}>
                                <NumberDropdown
                                    style={styles.textDropdown}
                                    defaultOption={timeZoneLocals?.timeHours}
                                    display={padTimeDigits}
                                    min={0}
                                    max={23}
                                    onOptionSelect={
                                        (hours) => {
                                            const adjustment = (compareZone?.difference ?? 0) * 60000;
                                            setOverrideTime(new Date(new Date(timeZoneLocals?.localTime ?? time).setHours(hours) - adjustment));
                                        }
                                    }
                                />
                            </Text>
                            <Text style={styles.clockSep}>:</Text>
                            <Text style={styles.clockDigits}>
                                <NumberDropdown
                                    style={styles.textDropdown}
                                    defaultOption={timeZoneLocals?.timeMinutes}
                                    display={padTimeDigits}
                                    min={0}
                                    max={59}
                                    onOptionSelect={
                                        (minutes) => {
                                            const adjustment = (compareZone?.difference ?? 0) * 60000;
                                            setOverrideTime(new Date(new Date(timeZoneLocals?.localTime ?? time).setMinutes(minutes) - adjustment));
                                        }
                                    }
                                />
                            </Text>
                            {/* <Text style={styles.clockDigitsSs}> */}
                                {overrideTime == null && settings.showSeconds && (
                                    <>
                                        <Text style={styles.clockSep}>:</Text>
                                        <Text style={styles.clockDigitsSs}>
                                            {padTimeDigits(timeZoneLocals?.timeSeconds)}
                                        </Text>
                                    </>
                                    )
                                }
                                {overrideTime !== null &&
                                 <Text style={styles.clockDigitsSs}>
                                    <TouchableOpacity
                                        style={styles.btnThemePrimary}
                                        onPress={() => {
                                            setOverrideTime(null);
                                            setIsTimeSelectOpen(false);
                                        }}
                                    >
                                        <Text style={styles.primaryText}>Reset</Text>
                                    </TouchableOpacity>
                                    </Text>
                                }
                            {/* </Text> */}
                        </View>
                        {/* <View style={styles.textSwapContainer}> */}
                            <View style={styles.clockTzRow}>
                                <Text style={styles.clockTzBadge}>
                                {timeZoneLocals?.timeZoneShort}
                                </Text>
                                <Text style={styles.clockTzLong}>
                                {timeZoneLocals?.timeZoneLong}
                                </Text>
                            </View>
                            {/* <View style={[styles.textSpacer, styles.clockTzRow]}>
                                <Text style={styles.clockTzBadge}>CEST</Text>
                                <Text style={styles.clockTzLong}>Central European Summer Time</Text>
                            </View>
                        </View> */}
                    </View>
                </View>
                {/* {apiError && <Text style={styles.apiError}>{apiError}</Text>} */}
            </View>
        </LinearGradient>
        </>
    );
}

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        cardWrapper: {
            padding: 1,
            borderRadius: 12,
            margin:0,
        },
        clockCard: {
            backgroundColor: theme.bgCard,
            borderRadius: 10,  // 1-2px less than wrapper to show the gradient "border"
            padding: 12,
        },
        localTimeCardContainer: {
            flexDirection: 'column',
            justifyContent: 'flex-start',
            margin: 0,
            width: 'auto',
            flex:0,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        clockIana: {
            fontSize: 11,
            fontWeight: '500',
            letterSpacing: 0.88,        // RN absolute values for 'em': 11 * 0.08
            textTransform: 'uppercase',
            color: theme.fontColor,
            marginBottom: 6,
            borderWidth: 1,
            borderColor: theme.fontColor, 
            // flex: 1,
        },
        textDropdown: {
            position: 'relative',
            borderWidth: 1,
            borderColor: theme.fontColor, 
        },
        numberUpDown: {
            position: 'relative',
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: theme.fontColor, 
            paddingLeft: 5,
            alignItems: 'center',
            fontSize: 4,
        },
        svgIcon: {
            // width: 50,
            // color: theme.fontColor,
        },
        textIcon: {
            fontSize: 35,
            color: theme.fontColor,
        },
        accentLine: {
            width: 40,
            height: 1,
            borderRadius: 1,
            marginTop: 0,
            marginBottom: 16,
            // opacity animated separately — see below
        },
        clockDow: {
            fontSize: 13,
            letterSpacing: 0.78,        // 13 * 0.06
            textTransform: 'uppercase',
            marginBottom: 4,
            color: theme.fontColor,
        },
        clockDate: {
            fontSize: 22,
            fontWeight: '500',
            marginBottom: 20,           // 1.25rem
            flexDirection: 'row',
            alignItems: 'stretch',
            gap: 8,
        },
        clockDivider: {
            height: 2,
            borderRadius: 1,
            marginBottom: 10,
            // LinearGradient again here, but as a thin bar
        },
        clockTime: {
            alignItems: 'center',
            gap: 4,
            // margin: 0 0 16,
            marginBottom: 16,
            flexDirection: 'row',
            // cursor: pointer,
            },
        clockDigits: {
            ...Typography.lg,
            fontWeight: '500',          // fontVariantNumeric not supported — use a monospace font instead
        },
        clockDigitsSs: {
            // fontSize: 38,
            ...Typography.lg,
            fontWeight: '500',
            marginTop: 'auto',
            marginBottom: 'auto',
            color: theme.fontColor,
        },
        clockSep: {
            fontSize: 32,
            opacity: 0.6,
            color: theme.accentPrimary
        },
        clockTzRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
        },
        clockTzBadge: {
            fontSize: 12,
            fontWeight: '500',
            paddingVertical: 3,
            paddingHorizontal: 10,
            color: theme.fontColor,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: theme.fontColor,
            backgroundColor: theme.bgSelected,
        },
        clockTzLong: {
            fontSize: 13,
            opacity: 0.6,
            flex: 1,
            color: theme.fontColor,
        },
        btnThemePrimary: {
            borderRadius: 2,
            // height: 36,
            // paddingVertical: 12,
            // paddingHorizontal: 6,
            fontSize: 13,
            cursor: 'pointer',
            backgroundColor: theme.fontColor,
            color: '#fff',
            alignItems: 'center',
            alignContent: 'center',
            alignSelf: 'center',
        },
        primaryText: {
            color: 'white',
            paddingVertical: 12,
            paddingHorizontal: 16,
            // margin:'auto',
        },
    })