import type { Dispatch, SetStateAction } from "react";
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface TabButtonProps {
    style: StyleProp<TextStyle> | undefined,
    tabName: string;
    tabText: string;
    activeTab: string;
    setActiveTab: Dispatch<SetStateAction<string>>;
}

// export default function CardColorsPanel(style: StyleProp<TextStyle> | undefined) {

export default function TabButton({ style, tabName, tabText, activeTab, setActiveTab }: TabButtonProps) {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
        <TouchableOpacity
            onPress={() => setActiveTab(tabName)}
            style={[style, styles.btnTab, {backgroundColor: activeTab === tabName ? '#007cba' : 'transparent',
                borderColor:  activeTab === tabName ? '#007cba' : theme.fontColor}]}
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
        paddingVertical: 12,
        paddingHorizontal: 6,
    },
    btnTab: {
        borderWidth: 1,
        borderRadius: 0,
        fontSize: 13,
        minWidth:90,
        cursor: 'pointer',
        backgroundColor: theme.fontColor,
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