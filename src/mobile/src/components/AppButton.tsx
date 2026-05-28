import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { radius, spacing, typography } from '../theme/theme';

interface AppButtonProps {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function AppButton({ disabled = false, label, onPress, variant = 'primary' }: AppButtonProps) {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: isPrimary ? colors.primary : colors.surface },
        !isPrimary && { borderColor: colors.borderStrong, borderWidth: 1 },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.label, { color: isPrimary ? '#ffffff' : colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.md,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  label: {
    fontSize: typography.small,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.45,
  },
});
