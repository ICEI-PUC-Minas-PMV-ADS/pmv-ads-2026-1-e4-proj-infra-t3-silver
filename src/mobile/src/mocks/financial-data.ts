import { Account, Budget, Category, Goal, Transaction, User } from '../types/financial';

export const mockUser: User = {
  id: 1,
  name: 'Família Silva',
  email: 'familia.silva@example.com',
};

export const mockAccounts: Account[] = [
  { id: 1, name: 'Conta corrente', type: 'checking', balance: 3240.85 },
  { id: 2, name: 'Reserva', type: 'savings', balance: 8200 },
  { id: 3, name: 'Cartão principal', type: 'credit', balance: -1260.4 },
];

export const mockCategories: Category[] = [
  { id: 1, name: 'Moradia', kind: 'expense', color: '#2563EB', icon: '🏠' },
  { id: 2, name: 'Mercado', kind: 'expense', color: '#059669', icon: '🛒' },
  { id: 3, name: 'Transporte', kind: 'expense', color: '#D97706', icon: '🚗' },
  { id: 4, name: 'Salário', kind: 'income', color: '#16A34A', icon: '💰' },
  { id: 5, name: 'Lazer', kind: 'expense', color: '#7C3AED', icon: '🎮' },
];

let nextCategoryId = 6;

export function addMockCategory(category: Omit<Category, 'id'>): Category {
  const newCategory: Category = { ...category, id: nextCategoryId++ };
  mockCategories.unshift(newCategory);
  return newCategory;
}

export function updateMockCategory(id: string | number, updates: Partial<Omit<Category, 'id'>>): Category | null {
  const index = mockCategories.findIndex((c) => String(c.id) === String(id));
  if (index === -1) return null;
  mockCategories[index] = { ...mockCategories[index], ...updates };
  return mockCategories[index];
}

export function deleteMockCategory(id: string | number): boolean {
  const index = mockCategories.findIndex((c) => String(c.id) === String(id));
  if (index === -1) return false;
  mockCategories.splice(index, 1);
  return true;
}

export const CATEGORY_COLORS = [
  '#2563EB', '#059669', '#D97706', '#7C3AED', '#DC2626',
  '#0891B2', '#DB2777', '#65A30D', '#C026D3', '#EA580C',
];

export const CATEGORY_ICONS = [
  '🏠', '🛒', '🚗', '💰', '🎮', '🍕', '📚', '🏥', '✈️', '👕',
  '💡', '📱', '🎵', '🐾', '🌿', '🔧', '📦', '🎓', '🏋️', '☕',
];

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    description: 'Salário mensal',
    amount: 6200,
    type: 'income',
    date: '2026-05-05',
    accountId: '1',
    categoryId: '4',
  },
  {
    id: 2,
    description: 'Aluguel',
    amount: 1800,
    type: 'expense',
    date: '2026-05-07',
    accountId: '1',
    categoryId: '1',
  },
  {
    id: 3,
    description: 'Compras da semana',
    amount: 486.72,
    type: 'expense',
    date: '2026-05-10',
    accountId: '1',
    categoryId: '2',
  },
  {
    id: 4,
    description: 'Combustível',
    amount: 210,
    type: 'expense',
    date: '2026-05-12',
    accountId: '3',
    categoryId: '3',
  },
  {
    id: 5,
    description: 'Cinema',
    amount: 96,
    type: 'expense',
    date: '2026-05-17',
    accountId: '3',
    categoryId: '5',
  },
];

export const mockBudgets: Budget[] = [
  { id: 1, categoryId: 1, limit: 2200, spent: 1800, month: '2026-05' },
  { id: 2, categoryId: 2, limit: 1200, spent: 486.72, month: '2026-05' },
  { id: 3, categoryId: 5, limit: 450, spent: 96, month: '2026-05' },
];

export const mockGoals: Goal[] = [
  {
    id: 1,
    name: 'Reserva de emergência',
    targetAmount: 15000,
    currentAmount: 8200,
    deadline: '2026-12-31',
  },
  {
    id: 2,
    name: 'Viagem em família',
    targetAmount: 6000,
    currentAmount: 1800,
    deadline: '2026-10-15',
  },
];
