import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { radius, spacing, typography } from '../theme/theme';

interface InfoCardProps extends PropsWithChildren {
  title: string;
  value?: string;
  tone?: 'default' | 'success' | 'danger' | 'warning';
}

export function InfoCard({ children, title, value, tone = 'default' }: InfoCardProps) {
  const { colors } = useTheme();

  const valueColor = {
    default: colors.text,
    success: colors.success,
    danger: colors.danger,
    warning: colors.warning,
  }[tone];

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.muted }]}>{title}</Text>
      {value ? <Text style={[styles.value, { color: valueColor }]}>{value}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  title: {
    fontSize: typography.small,
    fontWeight: '600',
  },
  value: {
    fontSize: typography.title,
    fontWeight: '700',
  },
});
