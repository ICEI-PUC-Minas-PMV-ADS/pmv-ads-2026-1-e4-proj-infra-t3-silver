export type AccountType = 'checking' | 'savings' | 'credit' | 'cash' | 'investment';

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
  _id?: string;
  id: string | number;
  name: string;
  type: AccountType;
  balance: number;
}

export interface CreateAccountPayload {
  name: string;
  type: AccountType;
  balance: number;
}

export interface Category {
  _id?: string;
  id: string | number;
  name: string;
  kind: CategoryKind;
  color: string;
  icon?: string;
}

export interface Transaction {
  _id?: string;
  id: string | number;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  accountId: string;
  categoryId: string;
  attachmentUrl?: string;
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

export interface Family {
  _id?: string;
  id?: string;
  name: string;
}

export interface FamilyMember {
  _id?: string;
  id?: string;
  name: string;
  email: string;
}

export interface CreateTransactionPayload {
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  accountId: string;
  categoryId: string;
}
