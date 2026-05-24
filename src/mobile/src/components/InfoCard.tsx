import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme/theme';

interface InfoCardProps extends PropsWithChildren {
  title: string;
  value?: string;
  tone?: 'default' | 'success' | 'danger' | 'warning';
}

export function InfoCard({ children, title, value, tone = 'default' }: InfoCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {value ? <Text style={[styles.value, styles[tone]]}>{value}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  title: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: '600',
  },
  value: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  default: {
    color: colors.text,
  },
  success: {
    color: colors.success,
  },
  danger: {
    color: colors.danger,
  },
  warning: {
    color: colors.warning,
  },
});
