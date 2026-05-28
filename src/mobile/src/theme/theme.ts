export const lightColors = {
  background: '#fafafa',
  surface: '#ffffff',
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  text: '#18181b',
  muted: '#71717a',
  mutedLight: '#a1a1aa',
  border: '#e4e4e7',
  borderStrong: '#d4d4d8',
  success: '#16a34a',
  danger: '#dc2626',
  warning: '#ca8a04',
  successLight: '#dcfce7',
  dangerLight: '#fee2e2',
  warningLight: '#fef9c3',
};

export const darkColors = {
  background: '#09090b',
  surface: '#18181b',
  primary: '#3b82f6',
  primaryDark: '#60a5fa',
  text: '#fafafa',
  muted: '#a1a1aa',
  mutedLight: '#71717a',
  border: '#3f3f46',
  borderStrong: '#52525b',
  success: '#22c55e',
  danger: '#f87171',
  warning: '#facc15',
  successLight: '#052e16',
  dangerLight: '#450a0a',
  warningLight: '#422006',
};

export type Colors = typeof lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 6,
  md: 12,
  full: 9999,
};

export const typography = {
  title: 24,
  subtitle: 18,
  body: 16,
  small: 14,
  xs: 12,
};

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// Alias para compatibilidade — prefer useTheme() nos componentes
export const colors = lightColors;
