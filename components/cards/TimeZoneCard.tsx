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
import {getHours12h, getHours24h, getMonthShort, padTimeDigits} from "@/utils/timezoneUtils";

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
    const [isTimeSelectOpen, setIsTimeSelectOpen] = useState<boolean>(false);
    const timeZoneLocals = refreshTimeZoneLocals(compareZone?.timeZone, compareZone?.utcOffset);
    const isPm = (timeZoneLocals?.timeHours ?? 0) >= 12;
    const [isPmOverride, setIsPmOverride] = useState<boolean | null>(null);
    const displayIsPm = isPmOverride ?? isPm;
    useEffect(() => {
        // Confirm re-render for savings/debugging
            console.log("useEffect compareZone: ", compareZone);

        if (timeZoneDefault == null) {
            handleZoneSelect("GMT");
        }
    }, []);

    async function handleZoneSelect(timeZone: string | null | undefined) {
        if (timeZone == null) return;
        setApiError(null);
        try {
            const utcOffset = getTimezoneOffset(timeZone);
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
        let hoursOverride;
        if (timeZoneLocals) {
            hoursOverride = displayIsPm
            ? timeZoneLocals?.timeHours - 12
            : timeZoneLocals?.timeHours + 12;
        }
        setIsPmOverride(prev => !(prev ?? isPm));
        const adjustment = (compareZone?.utcOffset ?? 0) * 60000;
        if (hoursOverride != null) {
            setOverrideTime(new Date(new Date(timeZoneLocals?.localTime ?? time).setHours(hoursOverride) - adjustment));
        }
    }
    
    function getTimezoneOffset(timeZone: string, date: Date = new Date()): number {
        try {
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

    function refreshTimeZoneLocals(timeZone: string | null | undefined, utcOffset: number | null | undefined): TimeZoneLocalsProps | undefined {
        if (timeZone == null || utcOffset == null) return;
        const baseTime = overrideTime ?? time;
        const localTime = new Date(baseTime.getTime() + utcOffset * 60000);
        if (localTime == null) return;

        const parts = timeZoneParts(baseTime, timeZone, true);

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
            timeMonth: parts.month - 1,  // Intl months are 1-based, JS months are 0-based
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
                                    max={getDaysInMonth(timeZoneLocals?.localTime ?? time)}
                                    onOptionSelect={
                                        (day) => {
                                            const adjustment = (compareZone?.utcOffset ?? 0) * 60000;
                                            setOverrideTime(new Date(new Date(timeZoneLocals?.localTime ?? time).setDate(day) - adjustment));
                                        }
                                    }
                                />
                            )}
                            <NumberDropdown style={styles.dropdownBtn}
                                fontStyle={styles.dateText}
                                defaultOption={timeZoneLocals?.timeMonth}
                                display={getMonthShort}
                                min={0}
                                max={11}
                                onOptionSelect={
                                    (month) => { 
                                        const adjustment = (compareZone?.utcOffset ?? 0) * 60000;
                                        setOverrideTime(new Date(new Date(timeZoneLocals?.localTime ?? time).setMonth(month) - adjustment));
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
                                    max={getDaysInMonth(timeZoneLocals?.localTime ?? time)}
                                    onOptionSelect={
                                        (day) => {
                                            const adjustment = (compareZone?.utcOffset ?? 0) * 60000;
                                            setOverrideTime(new Date(new Date(timeZoneLocals?.localTime ?? time).setDate(day) - adjustment));
                                        }
                                    }
                                />
                            )}
                            <NumberUpDown 
                                style={styles.dropdownBtn}
                                fontStyle={styles.dateText}
                                input={timeZoneLocals?.timeYear} onChange={
                                    (year) => { 
                                        const adjustment = (compareZone?.utcOffset ?? 0) * 60000;
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
                            <NumberDropdown
                                style={styles.dropdownBtn}
                                fontStyle={styles.clockDigits}
                                defaultOption={settings.use24Hour ? timeZoneLocals?.timeHours : getHours12h(timeZoneLocals?.timeHours ?? 0)}
                                display={settings.use24Hour ? padTimeDigits : getHours12h}
                                min={settings.use24Hour ? 0 : 1}
                                max={settings.use24Hour ? 23 : 12}
                                onOptionSelect={
                                    (hours) => {
                                        const adjustment = (compareZone?.utcOffset ?? 0) * 60000;
                                        setOverrideTime(new Date(new Date(timeZoneLocals?.localTime ?? time).setHours(settings.use24Hour ? hours : getHours24h(hours, displayIsPm)) - adjustment));
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
                                    (minutes) => {
                                        const adjustment = (compareZone?.utcOffset ?? 0) * 60000;
                                        setOverrideTime(new Date(new Date(timeZoneLocals?.localTime ?? time).setMinutes(minutes) - adjustment));
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
                                    <Text style={styles.clockAmPm}>{displayIsPm ? 'pm' : 'am'}</Text> 
                                    <Switch
                                        value={displayIsPm}
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
                                        setIsPmOverride(null);
                                        setIsTimeSelectOpen(false);
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
            // fontSize: 13,
            letterSpacing: 0.78,        // 13 * 0.06
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
            // margin: 0 0 16,
            marginBottom: 16,
            flexDirection: 'row',
            // cursor: pointer,
            },
        clockDigits: {
            ...Typography.xlHeavy,
            color: theme.fontColor,
            flexWrap: 'nowrap',
            flex:1,
            // fontVariantNumeric not supported — use a monospace font if needed
        },
        clockDigitsSs: {
            ...Typography.xlHeavy,
            // marginTop: 'auto',
            // marginBottom: 'auto',
            color: theme.fontColor,
            flexWrap: 'nowrap',
            flex:1,
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
            // height: 36,
            // paddingVertical: 12,
            // paddingHorizontal: 6,
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
            // margin:'auto',
        },
    })