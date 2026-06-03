import { formatCurrency, formatDate, formatPercent } from '../src/utils/formatters';

test('formatCurrency formata valor em reais', () => {
  const result = formatCurrency(1500.50);
  expect(result).toContain('1.500');
  expect(result).toContain('50');
});

test('formatCurrency formata zero', () => {
  const result = formatCurrency(0);
  expect(result).toContain('0');
});

test('formatDate formata data no padrao brasileiro', () => {
  const result = formatDate('2026-06-15');
  expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  expect(result).toContain('2026');
});

test('formatPercent formata porcentagem', () => {
  const result = formatPercent(0.75);
  expect(result).toContain('75');
});
