import { lightColors, darkColors, spacing, radius, typography } from '../src/theme/theme';

test('RF11 - tema claro possui todas as chaves necessarias', () => {
  expect(lightColors).toHaveProperty('background');
  expect(lightColors).toHaveProperty('surface');
  expect(lightColors).toHaveProperty('primary');
  expect(lightColors).toHaveProperty('text');
  expect(lightColors).toHaveProperty('success');
  expect(lightColors).toHaveProperty('danger');
  expect(lightColors).toHaveProperty('warning');
});

test('RF11 - tema escuro possui todas as chaves necessarias', () => {
  expect(darkColors).toHaveProperty('background');
  expect(darkColors).toHaveProperty('surface');
  expect(darkColors).toHaveProperty('primary');
  expect(darkColors).toHaveProperty('text');
  expect(darkColors).toHaveProperty('success');
  expect(darkColors).toHaveProperty('danger');
  expect(darkColors).toHaveProperty('warning');
});

test('RF11 - tema claro e escuro tem valores diferentes', () => {
  expect(lightColors.background).not.toBe(darkColors.background);
  expect(lightColors.text).not.toBe(darkColors.text);
});

test('spacing contem valores esperados', () => {
  expect(spacing.sm).toBe(8);
  expect(spacing.md).toBe(16);
  expect(spacing.lg).toBe(24);
});

test('radius contem valores esperados', () => {
  expect(radius.sm).toBe(6);
  expect(radius.md).toBe(12);
  expect(radius.full).toBe(9999);
});

test('typography contem valores esperados', () => {
  expect(typography.title).toBe(24);
  expect(typography.body).toBe(16);
  expect(typography.small).toBe(14);
});
