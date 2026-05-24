import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing, typography } from '../theme/theme';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function AppButton({ label, onPress, variant = 'primary' }: AppButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.secondaryLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.md,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  primaryLabel: {
    color: colors.surface,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  secondaryLabel: {
    color: colors.primaryDark,
  },
  label: {
    fontSize: typography.body,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.78,
  },
});
