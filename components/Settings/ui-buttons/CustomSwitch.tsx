import { useEffect, useMemo, useRef } from 'react';
import { Animated, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface CustomSwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    theme: ReturnType<typeof useTheme>;
}

export default function CustomSwitch({ value, onValueChange, theme }: CustomSwitchProps) {
    const styles = useMemo(() => makeStyles(theme), [theme]);
    const translateX = useRef(new Animated.Value(value ? 20 : 0)).current;

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: value ? 20 : 0,
            duration: 500,
            useNativeDriver: Platform.OS !== 'web',
        }).start();
        console.log('Animated.Value:', Animated.Value);
        console.log('translateX:', translateX);
        console.log('value:', value);
    }, [value]);

    // const handlePress = () => {
    //     const toValue = value ? 0 : 20;
    //     Animated.timing(translateX, {
    //         toValue,
    //         duration: 600,
    //         useNativeDriver: Platform.OS !== 'web',
    //     }).start();
    //     onValueChange(!value);
    // };

    return (
        <TouchableOpacity
        //onPress={handlePress}
            onPress={() => {
                onValueChange(!value);}}
            activeOpacity={0.8}
            style={[styles.track, { backgroundColor: value ? theme.accentSecondary : theme.bgSelected }]}
        >
            <Animated.View style={[styles.thumb, { backgroundColor: theme.accentPrimary, transform: [{ translateX }] }]} />
        </TouchableOpacity>
    );
}

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        track: {
            width: 40,
            height: 14,
            borderRadius: 15.5,
            padding: 0,
            justifyContent: 'center',
            overflow: 'visible',
        },
        thumb: {
            width: 20,
            height: 20,
            borderRadius: 13.5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 2,
        },
        thumbLeft: {
            alignSelf: 'flex-start',
        },
        thumbRight: {
            alignSelf: 'flex-end',
        },
    });