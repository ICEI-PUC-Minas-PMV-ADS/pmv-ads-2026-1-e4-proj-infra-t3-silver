import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { spacing, typography } from '../theme/theme';

interface ScreenProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
}

export function Screen({ children, title, subtitle }: ScreenProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={{ backgroundColor: colors.background }}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text> : null}
      </View>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    gap: spacing.xs,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  title: {
    fontSize: typography.title,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: typography.small,
    lineHeight: 20,
  },
});
