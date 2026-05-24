import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import {
  Account,
  AuthResponse,
  Budget,
  Category,
  CreateTransactionPayload,
  Goal,
  Transaction,
  User,
} from '../types/financial';

const TOKEN_KEY = '@silver:auth_token';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function saveAuthToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function clearAuthToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/login', { email, password });
  await saveAuthToken(response.data.token);

  return response.data;
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/register', { name, email, password });
  await saveAuthToken(response.data.token);

  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>('/me');
  return response.data;
}

export async function getAccounts(): Promise<Account[]> {
  const response = await api.get<Account[]>('/accounts');
  return response.data;
}

export async function getTransactions(): Promise<Transaction[]> {
  const response = await api.get<Transaction[]>('/transactions');
  return response.data;
}

export async function createTransaction(payload: CreateTransactionPayload): Promise<Transaction> {
  const response = await api.post<Transaction>('/transactions', payload);
  return response.data;
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>('/categorias');
  return response.data;
}

export async function getBudgets(): Promise<Budget[]> {
  const response = await api.get<Budget[]>('/budgets');
  return response.data;
}

export async function getGoals(): Promise<Goal[]> {
  const response = await api.get<Goal[]>('/goals');
  return response.data;
}

export async function syncSince(date: string): Promise<{
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  goals: Goal[];
}> {
  const response = await api.get('/sync', { params: { since: date } });
  return response.data;
}
