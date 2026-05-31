import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { radius, spacing, typography } from '../theme/theme';

interface AppButtonProps {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function AppButton({ disabled = false, label, onPress, variant = 'primary' }: AppButtonProps) {
  const { colors } = useTheme();

  const bgColor =
    variant === 'primary' ? colors.primary :
    variant === 'danger'  ? colors.danger  :
    colors.surface;

  const textColor =
    variant === 'primary' || variant === 'danger' ? '#ffffff' : colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bgColor },
        variant === 'secondary' && { borderColor: colors.borderStrong, borderWidth: 1 },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
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
