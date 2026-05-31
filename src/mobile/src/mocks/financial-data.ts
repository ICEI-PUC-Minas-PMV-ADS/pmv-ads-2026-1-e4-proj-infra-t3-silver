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
  { id: 1, name: 'Moradia', kind: 'expense', color: '#2563EB' },
  { id: 2, name: 'Mercado', kind: 'expense', color: '#059669' },
  { id: 3, name: 'Transporte', kind: 'expense', color: '#D97706' },
  { id: 4, name: 'Salário', kind: 'income', color: '#16A34A' },
  { id: 5, name: 'Lazer', kind: 'expense', color: '#7C3AED' },
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
  { id: '1', categoryId: '1', limitAmount: 2200, spentAmount: 1800, monthYear: '2026-05' },
  { id: '2', categoryId: '2', limitAmount: 1200, spentAmount: 486.72, monthYear: '2026-05' },
  { id: '3', categoryId: '5', limitAmount: 450, spentAmount: 96, monthYear: '2026-05' },
];

export const mockGoals: Goal[] = [
  {
    id: 1,
    title: 'Reserva de emergência',
    target_amount: 15000,
    current_amount: 8200,
    deadline: '2026-12-31',
    status: 'ativa',
  },
  {
    id: 2,
    title: 'Viagem em família',
    target_amount: 6000,
    current_amount: 1800,
    deadline: '2026-10-15',
    status: 'ativa',
  },
];
