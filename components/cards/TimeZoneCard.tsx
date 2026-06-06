import { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
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
import {getHours12h, getHours24h, getMonthShort, padTimeDigits, partsToUTC, timeZoneParts} from "@/utils/timezoneUtils";

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
  utcOffset: number;
}

export default function TimeZoneCard({timeZoneNames, time, overrideTime, setOverrideTime, timeZoneDefault}: TimeZoneCardProps) {
    const {settings} = useSettings();
    const theme = useTheme();
    const styles = makeStyles(theme);
    const [compareZone, setCompareZone] = useState<CompareZoneProps | null>({timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, utcOffset: 0});
    const [apiError, setApiError] = useState<string | null>(null);
    // const [isTimeSelectOpen, setIsTimeSelectOpen] = useState<boolean>(false);
    
    const baseTime = overrideTime ?? time;
    const adjustment = (compareZone?.utcOffset ?? 0) * 60000;
    const timeZoneLocals = refreshTimeZoneLocals(compareZone?.timeZone, compareZone?.utcOffset);
    const currentHour = timeZoneLocals?.timeHours ?? 0;
    const currentTimeZone = timeZoneLocals?.timeZoneShort ?? "GMT";
    const isPm = currentHour >= 12;

    // Handle initial mount
    useEffect(() => {
        // Confirm re-render for savings/debugging
        console.log("useEffect render compareZone: ", compareZone);
        handleZoneSelect(timeZoneDefault ?? "GMT");
    }, []);

    // Handle changes in time zone name (e.g., standard/daylight)
    useEffect(() => {
        console.log("useEffect currentTimeZone changed before.", currentTimeZone, "uctOffset: ", compareZone?.utcOffset);
        handleZoneSelect(compareZone?.timeZone ?? "GMT", baseTime);
        console.log("useEffect currentTimeZone changed.", currentTimeZone, "uctOffset: ", compareZone?.utcOffset);
    }, [currentTimeZone]);

    async function handleZoneSelect(timeZone: string, date?: Date) {
        if (timeZone == null) return;
        setApiError(null);
        try {
            const utcOffset = getTimezoneOffset(timeZone, date);
            if (isNaN(utcOffset)) {
            setApiError("Invalid timezone offset");
            return;
            }
            setCompareZone({ timeZone, utcOffset });
        } catch (e) {
            setApiError("Invalid timezone: " + e);
        }
    }

    function handleAmPmToggle() {
        const deltaMs = isPm ? -12 * 3600000 : +12 * 3600000;
        const newTime = new Date(baseTime.getTime() + deltaMs);
        setOverrideTime(newTime);
    }

    function getTimezoneOffset(timeZone: string, date: Date = new Date()): number {
        try {
            const utcParts = timeZoneParts(date, 'UTC');
            const tzParts = timeZoneParts(date, timeZone);
            const utcMs = partsToUTC(utcParts);
            const tzMs = partsToUTC(tzParts);
            console.log("getTimezoneOffset utcParts.", utcParts);
            console.log("getTimezoneOffset tzParts.", tzParts);


            return (tzMs - utcMs) / 60000;
        } catch (e) {
            console.error('getTimezoneOffset failed for:', timeZone, e);
            return 0;
        }
    }

    function getDaysInMonth(year: number | undefined, month: number | undefined): number {
        if (year == null || month == null) return 31;
        // month here is 1-based (Intl convention), so month gets the next month, day 0 = last day of current month
        return new Date(year, month, 0).getDate();
    }

    function refreshTimeZoneLocals(timeZone: string | null | undefined, utcOffset: number | null | undefined): TimeZoneLocalsProps | undefined {
        if (timeZone == null || utcOffset == null) return;
        console.log('refreshTimeZoneLocals timeZone: ', timeZone, 'utcOffset: ', utcOffset);
        const localTime = new Date(baseTime.getTime() + utcOffset * 60000);
        if (localTime == null) return;

        const parts = timeZoneParts(baseTime, timeZone);
        //console.log('refreshTimeZoneLocals parts: ', parts);

        return {
            timeZoneName: timeZone,
            localTime,
            // timeFullDate: localTime.toLocaleString("default", {
            //     day: "numeric", month: "long", year: "numeric",
            // }),
            timeFullDate: new Intl.DateTimeFormat("default", {
                day: "numeric", month: "long", year: "numeric",
                timeZone,
            }).format(baseTime),
            timeDate: parts.day,
            timeMonth: parts.month,
            timeYear: parts.year,
            // timeDow: localTime.toLocaleString("default", { weekday: "long" }),
            timeDow: new Intl.DateTimeFormat("default", {
                weekday: "long",
                timeZone,
            }).format(baseTime),
            timeHours: parts.hour,
            timeMinutes: parts.minute,
            timeSeconds: parts.second,
            timeZoneShort: new Intl.DateTimeFormat("default", {
                timeZoneName: "short", timeZone,
            }).formatToParts(time).find(p => p.type === "timeZoneName")?.value ?? null,
            timeZoneLong: new Intl.DateTimeFormat("default", {
                timeZoneName: "long", timeZone,
            }).formatToParts(time).find(p => p.type === "timeZoneName")?.value ?? null,
        } as TimeZoneLocalsProps;
    }

    return (
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
                            <TimeZoneDropdown style={styles.clockIana}
                                fontStyle={styles.tzText}
                                defaultOption={timeZoneLocals?.timeZoneName}
                                dropdownOptions={timeZoneNames}
                                onOptionSelect={(timeZone: string) => handleZoneSelect(timeZone)}
                            />
                            <MaterialCommunityIcons name="timetable"  style={styles.textIcon} colors={theme.dividerBarGrad}/>                           
                        </View>
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
                                    style={styles.dropdownBtn}
                                    fontStyle={styles.dateText}
                                    defaultOption={timeZoneLocals?.timeDate}
                                    display={padTimeDigits}
                                    min={1}
                                    max={getDaysInMonth(timeZoneLocals?.timeYear, timeZoneLocals?.timeMonth)}
                                    onOptionSelect={
                                        (day) => {
                                            const tzParts = timeZoneParts(baseTime, timeZoneLocals?.timeZoneName ?? "UTC");
                                            const utcMs = partsToUTC(tzParts, {day: day}) - adjustment;
                                            setOverrideTime(new Date(utcMs));
                                        }
                                    }
                                />
                            )}
                            <NumberDropdown style={styles.dropdownBtn}
                                fontStyle={styles.dateText}
                                defaultOption={timeZoneLocals?.timeMonth}
                                display={getMonthShort}
                                min={1}
                                max={12}
                                onOptionSelect={
                                    (month) => {
                                        const tzParts = timeZoneParts(baseTime, timeZoneLocals?.timeZoneName ?? "UTC");
                                        //console.log("month selected tzParts: ", tzParts);
                                        const utcMs = partsToUTC(tzParts, {month: month}) - adjustment;
                                        setOverrideTime(new Date(utcMs));
                                    }
                                }
                            />
                            {/* Put day second if not DMY setting */}
                            {settings.dateFormat !== "DMY" && (
                                <NumberDropdown
                                    style={styles.dropdownBtn}
                                    fontStyle={styles.dateText}
                                    defaultOption={timeZoneLocals?.timeDate}
                                    display={padTimeDigits}
                                    min={1}
                                    max={getDaysInMonth(timeZoneLocals?.timeYear, timeZoneLocals?.timeMonth)}
                                    onOptionSelect={
                                        (day) => {
                                            const tzParts = timeZoneParts(baseTime, timeZoneLocals?.timeZoneName ?? "UTC");
                                            const utcMs = partsToUTC(tzParts, {day: day}) - adjustment;
                                            setOverrideTime(new Date(utcMs));
                                        }
                                    }
                                />
                            )}
                            <NumberUpDown 
                                style={styles.dropdownBtn}
                                fontStyle={styles.dateText}
                                input={timeZoneLocals?.timeYear} onChange={
                                    (year) => {
                                        const tzParts = timeZoneParts(baseTime, timeZoneLocals?.timeZoneName ?? "UTC");
                                        //console.log("year selected tzParts: ", tzParts);
                                        const utcMs = partsToUTC(tzParts, {year: year}) - adjustment;
                                        setOverrideTime(new Date(utcMs));
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
                            <NumberDropdown
                                style={styles.dropdownBtn}
                                fontStyle={styles.clockDigits}
                                defaultOption={settings.use24Hour ? timeZoneLocals?.timeHours : getHours12h(timeZoneLocals?.timeHours ?? 0)}
                                display={settings.use24Hour ? padTimeDigits : getHours12h}
                                min={settings.use24Hour ? 0 : 1}
                                max={settings.use24Hour ? 23 : 12}
                                onOptionSelect={
                                    (hours) => {
                                        // const hours24 = settings.use24Hour ? hours : getHours24h(hours, isPm);
                                        // const tzParts = timeZoneParts(baseTime, timeZoneLocals?.timeZoneName ?? "UTC");
                                        // const newUtcMs = partsToUTC(tzParts, { hour: hours24 }) - adjustment;
                                        // const newTime = new Date(newUtcMs);
                                        
                                        // // Recalculate offset for the new time to handle DST transitions
                                        // const freshOffset = getTimezoneOffset(compareZone?.timeZone ?? "GMT", newTime);
                                        // const freshAdjustment = freshOffset * 60000;
                                        // const correctedMs = partsToUTC(tzParts, { hour: hours24 }) - freshAdjustment;
                                        
                                        // setOverrideTime(new Date(correctedMs));
                                        // console.log('utc NewDate: ', new Date(correctedMs));

                                        const hours24 = settings.use24Hour ? hours : getHours24h(hours, isPm);
                                        const tzParts = timeZoneParts(baseTime, timeZoneLocals?.timeZoneName ?? "UTC");
                                      
                                        const utcMs = partsToUTC(tzParts, {hour: hours24}) - adjustment;
                                       
                                        setOverrideTime(new Date(utcMs));

                                        console.log('hour dropdown hourSelected: ', hours);
                                        console.log('hour dropdown tzParts: ', tzParts);

                                        //console.log('utc NewDate: ', new Date(utcMs));
                                    }
                                }
                            />
                            <Text style={styles.clockSep}>:</Text>
                            <NumberDropdown
                                style={styles.dropdownBtn}
                                fontStyle={styles.clockDigits}
                                defaultOption={timeZoneLocals?.timeMinutes}
                                display={padTimeDigits}
                                min={0}
                                max={59}
                                onOptionSelect={
                                    (minute) => {
                                        const tzParts = timeZoneParts(baseTime, timeZoneLocals?.timeZoneName ?? "UTC");
                                        const utcMs = partsToUTC(tzParts, {minute: minute}) - adjustment;
                                        setOverrideTime(new Date(utcMs));
                                    }
                                }
                            />
                            {overrideTime == null && settings.showSeconds && (
                                <>
                                    <Text style={styles.clockSep}>:</Text>
                                    <Text style={styles.clockDigitsSs}>
                                        {padTimeDigits(timeZoneLocals?.timeSeconds)}
                                    </Text>
                                </>
                                )
                            }
                            {!settings.use24Hour && 
                                <View style={styles.clockAmPmToggle}>
                                    <Text style={styles.clockAmPm}>{isPm ? 'pm' : 'am'}</Text> 
                                    <Switch
                                        value={isPm}
                                        onValueChange={handleAmPmToggle}
                                        thumbColor={theme.accentPrimary}
                                        trackColor={{ false: theme.bgSelected, true: theme.accentSecondary }}
                                        />
                                </View>
                            }
                            {overrideTime !== null &&
                                <TouchableOpacity
                                    style={styles.btnThemePrimary}
                                    onPress={() => {
                                        setOverrideTime(null);
                                        //setIsTimeSelectOpen(false);
                                    }}
                                >
                                    <Text style={styles.primaryText}>Reset</Text>
                                </TouchableOpacity>
                            }
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
            ...Typography.lgHeavy,
            letterSpacing: 0.88,        // RN absolute values for 'em': 11 * 0.08
            textTransform: 'uppercase',
            color: theme.fontColor,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: theme.fontColor, 
            // flex: 1,
        },
        tzText: {
            ...Typography.md,
            letterSpacing: 0.88,        // RN absolute values for 'em': 11 * 0.08
            color: theme.fontColor,
            // alignSelf: 'center',
            // marginBottom: 6,
            // borderWidth: 1,  
            // borderColor: theme.fontColor, 
            // flex: 1,
        },
        dropdownBtn: {
            position: 'relative',
            borderWidth: 1,
            borderColor: theme.fontColor, 
            alignSelf: 'stretch',
            justifyContent: 'center',
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
            // opacity animated separately
        },
        clockDow: {
            ...Typography.base,
            letterSpacing: 0.78,
            textTransform: 'uppercase',
            marginBottom: 4,
            color: theme.fontColor,
        },
        clockDate: {
            fontSize: 22,
            fontWeight: '500',
            color: theme.fontColor,
            marginBottom: 20,
            flexDirection: 'row',
            // alignItems: 'stretch',
            // alignContent: 'center',
            gap: 8,
        },
        dateText: {
            ...Typography.lgBook,
            letterSpacing: 0.88,        // RN absolute values for 'em': 11 * 0.08
            color: theme.fontColor,
            // alignSelf: 'center',
            // marginBottom: 6,
            // borderWidth: 1,
            // borderColor: theme.fontColor, 
            // flex: 1,
        },
        clockDivider: {
            height: 2,
            borderRadius: 1,
            marginBottom: 10,
        },
        clockTime: {
            alignItems: 'center',
            gap: 4,
            marginBottom: 16,
            flexDirection: 'row',
            // cursor: pointer,
            },
        clockDigits: {
            ...Typography.xlHeavy,
            color: theme.fontColor,
            //flexWrap: 'nowrap',
            // flex:1,
            // fontVariantNumeric not supported — use a monospace font if needed
        },
        clockDigitsSs: {
            ...Typography.xlBook,
            // marginTop: 'auto',
            // marginBottom: 'auto',
            color: theme.fontColor,
            // flexWrap: 'nowrap',
            // flex:1,
        },
        clockAmPm: {
            fontSize: 13,
            opacity: 0.6,
            flex: 1,
            color: theme.fontColor,
            marginTop: 10,
        },
        clockAmPmToggle: {
            flexDirection: 'column',
            alignSelf: 'stretch',
            alignItems: 'center',
            paddingHorizontal: 10,
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
            ...Typography.smHeavy,
            paddingVertical: 3,
            paddingHorizontal: 10,
            color: theme.fontColor,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: theme.fontColor,
            backgroundColor: theme.bgSelected,
        },
        clockTzLong: {
            ...Typography.base,
            opacity: 0.6,
            flex: 1,
            color: theme.fontColor,
        },
        btnThemePrimary: {
            borderRadius: 2,
            cursor: 'pointer',
            backgroundColor: theme.fontColor,
            color: '#fff',
            alignItems: 'center',
            alignContent: 'center',
            alignSelf: 'center',
        },
        primaryText: {
            color: 'white',
            ...Typography.base,
            paddingVertical: 12,
            paddingHorizontal: 16,
        },
    })