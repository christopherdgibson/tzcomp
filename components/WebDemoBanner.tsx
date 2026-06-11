import { Platform, View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export default function WebDemoBanner() {
    if (Platform.OS !== 'web') return null;
    const theme = useTheme();
    const styles = makeStyles(theme);

    return (
        <View style={styles.banner}>
            <Text style={styles.bannerIcon}>📱</Text>
            <View style={styles.bannerText}>
                <Text style={styles.bannerTitle}>Web Demo</Text>
                <Text style={styles.bannerBody}>
                    TZComp is an Android app — you're viewing a browser preview. 
                    Some interactions work best on a touch screen.
                </Text>
            </View>
            <TouchableOpacity
                style={styles.downloadBtn}
                onPress={() => Linking.openURL('https://christopherdgibson.github.io/assets/downloads/tzcomp.apk')}
                // onPress={() => Linking.openURL('https://github.com/christopherdgibson/tzcomp/releases/latest')}
            >
                <Text style={styles.downloadText}>↓ APK</Text>
            </TouchableOpacity>
        </View>
    );
}

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        banner: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingVertical: 10,
            paddingHorizontal: 14,
            marginBottom: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.fontColor,
            opacity: 0.7,
        },
        bannerIcon: {
            marginTop: 10,
            fontSize: 20,
            alignContent: 'center',
        },
        bannerText: {
            flex: 1,
        },
        bannerTitle: {
            color: theme.fontColor,
            fontFamily: 'AvenirLTStdHeavy',
            fontSize: 13,
            marginBottom: 6,
            backgroundColor: theme.bgCard,
            paddingHorizontal: 6,
            paddingVertical: 4,
            flexShrink: 1,
            borderColor: theme.fontColor,
            borderRadius: 12,
            alignSelf: 'flex-start',
        },
        bannerBody: {
            color: '#fff',  
            fontFamily: 'AvenirLTStdBook',
            fontSize: 12,
            opacity: 0.8,
        },
        downloadBtn: {
            marginTop: 10,
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 4,
            backgroundColor: theme.fontColor,
        },
        downloadText: {
            color: theme.bgContainer,
            fontFamily: 'AvenirLTStdHeavy',
            fontSize: 12,
        },
    });