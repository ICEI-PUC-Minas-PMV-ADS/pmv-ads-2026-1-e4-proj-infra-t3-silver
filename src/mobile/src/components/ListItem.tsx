import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme/theme';

interface ListItemProps {
  title: string;
  description?: string;
  amount?: string;
  accentColor?: string;
}

export function ListItem({ title, description, amount, accentColor = colors.primary }: ListItemProps) {
  return (
    <View style={styles.item}>
      <View style={[styles.accent, { backgroundColor: accentColor }]} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {amount ? <Text style={styles.amount}>{amount}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  accent: {
    borderRadius: radius.sm,
    height: 36,
    width: 6,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  description: {
    color: colors.muted,
    fontSize: typography.small,
  },
  amount: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
  },
});
