export type AccountType = 'checking' | 'savings' | 'credit' | 'cash';

export type TransactionType = 'income' | 'expense';

export type CategoryKind = TransactionType | 'both';

export interface User {
  id?: number | string;
  _id?: string;
  name: string;
  email: string;
  familyId?: string;
  whatsappNumber?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  token_type: 'Bearer';
}

export interface Account {
  id: number;
  name: string;
  type: AccountType;
  balance: number;
}

export interface Category {
  id: number;
  name: string;
  kind: CategoryKind;
  color: string;
}

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  accountId: number;
  categoryId: number;
}

export interface Budget {
  id: number;
  categoryId: number;
  limit: number;
  spent: number;
  month: string;
}

export interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface CreateTransactionPayload {
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  account_id: number;
  category_id: number;
}
