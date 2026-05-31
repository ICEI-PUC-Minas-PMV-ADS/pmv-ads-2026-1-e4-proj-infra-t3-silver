import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { radius, spacing, typography } from '../theme/theme';

interface ListItemProps {
  title: string;
  description?: string;
  amount?: string;
  accentColor?: string;
}

export function ListItem({ title, description, amount, accentColor }: ListItemProps) {
  const { colors } = useTheme();
  const accent = accentColor ?? colors.primary;

  return (
    <View style={[styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.accent, { backgroundColor: accent }]} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {description ? <Text style={[styles.description, { color: colors.muted }]}>{description}</Text> : null}
      </View>
      {amount ? <Text style={[styles.amount, { color: colors.text }]}>{amount}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + spacing.xs,
  },
  accent: {
    borderRadius: radius.full,
    height: 32,
    width: 4,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: typography.body,
    fontWeight: '600',
  },
  description: {
    fontSize: typography.small,
  },
  amount: {
    fontSize: typography.small,
    fontWeight: '600',
  },
});
