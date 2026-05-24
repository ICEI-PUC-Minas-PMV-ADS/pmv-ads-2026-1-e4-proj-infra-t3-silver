import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme/theme';

interface ScreenProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
}

export function Screen({ children, title, subtitle }: ScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    gap: spacing.md,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
  },
});
