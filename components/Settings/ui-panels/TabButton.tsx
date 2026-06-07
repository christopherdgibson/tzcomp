import type { Dispatch, SetStateAction } from "react";
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

import { Typography } from '@/constants/theme';

interface TabButtonProps {
    style: StyleProp<TextStyle> | undefined,
    tabName: string;
    tabText: string;
    activeTab: string;
    setActiveTab: Dispatch<SetStateAction<string>>;
}

export default function TabButton({ style, tabName, tabText, activeTab, setActiveTab }: TabButtonProps) {
    const theme = useTheme();
    const styles = makeStyles(theme);

    return (
        <TouchableOpacity
            onPress={() => setActiveTab(tabName)}
            style={[style, styles.btnTab, activeTab == tabName && styles.segmentActive]}
        >
            <Text style={[styles.btnText, {color: activeTab === tabName ? '#ffffff' : theme.fontColor}]}>{tabText}</Text>
        </TouchableOpacity>
    );
}

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
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
        btnText: {
            ...Typography.md,
            paddingVertical: 12,
            paddingHorizontal: 6,
        },
        segmentActive: {
            backgroundColor: theme.accentPrimary,
            borderColor: theme.accentPrimary,
            //backgroundColor: '#007cba' ,
        },
        btnTab: {
            borderWidth: 1,
            borderRadius: 0,
            minWidth:90,
            cursor: 'pointer',
            backgroundColor: 'transparent',
            borderColor: theme.fontColor,
            color: '#fff',
            alignItems: 'center',
            alignContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.2,
            shadowRadius: 1,
            padding: 6,
        },
        //  &:hover {
        //         background-color: var(--wp-admin-theme-color-darker-10, #006ba1);
        //     }
    });