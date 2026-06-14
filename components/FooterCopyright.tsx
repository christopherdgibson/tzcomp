import { useMemo } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Typography } from '@/constants/theme';

export default function FooterCopyright() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const year = new Date().getFullYear();

  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        © {year} Christopher Gibson
      </Text>
      <Text style={styles.footerDivider}>·</Text>
      <TouchableOpacity onPress={() => Linking.openURL('https://christopherdgibson.github.io')}>
        <Text style={styles.footerLink}>christopherdgibson.github.io</Text>
      </TouchableOpacity>
    </View>
  );
}

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        footer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            paddingVertical: 16,
            marginTop: 24,
            borderTopWidth: 1,
            borderTopColor: theme.bgSelected,
        },
        footerText: {
          ...Typography.sm,
            color: theme.fontSubtle,
        },
            footerDivider: {
              ...Typography.sm,
            color: theme.fontSubtle,
        },
            footerLink: {
              ...Typography.sm,
            color: theme.accentPrimary,
        },
    })