import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import {
  Account,
  AuthResponse,
  Budget,
  Category,
  CreateAccountPayload,
  CreateTransactionPayload,
  Family,
  FamilyMember,
  Goal,
  CreateGoalPayload,
  Transaction,
  User,
} from '../types/financial';

const TOKEN_KEY = '@silver:auth_token';
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.15.27:8000/api';

// Substitui o host do attachmentUrl pelo mesmo host da API,
// corrigindo URLs gravadas com localhost ou 127.0.0.1 no banco.
export function resolveAttachmentUrl(attachmentUrl: string): string {
  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, '');
  return attachmentUrl.replace(/^https?:\/\/[^/]+/, apiOrigin);
}

export const api = axios.create({
  baseURL: API_BASE_URL,
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API ERROR STATUS:', error.response?.status);
    console.log('API ERROR DATA:', error.response?.data);
    console.log('API ERROR URL:', error.config?.url);
    console.log('API BASE URL:', API_BASE_URL);

    return Promise.reject(error);
  }
);

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

export async function createAccount(payload: CreateAccountPayload): Promise<Account> {
  const response = await api.post<Account>('/accounts', payload);
  return response.data;
}

export async function updateAccount(id: string, payload: Partial<CreateAccountPayload>): Promise<Account> {
  const response = await api.put<Account>(`/accounts/${id}`, payload);
  return response.data;
}

export async function deleteAccount(id: string): Promise<void> {
  await api.delete(`/accounts/${id}`);
}

export async function getTransactions(): Promise<Transaction[]> {
  const response = await api.get<{ data: Transaction[] } | Transaction[]>('/transactions');
  const result = response.data;
  if (Array.isArray(result)) return result;
  return (result as { data: Transaction[] }).data ?? [];
}

export async function getTransaction(id: string): Promise<Transaction> {
  const response = await api.get<Transaction>(`/transactions/${id}`);
  return response.data;
}

export async function createTransaction(
  payload: CreateTransactionPayload,
  receiptUri?: string
): Promise<Transaction> {
  if (receiptUri) {
    const filename = receiptUri.split('/').pop() ?? 'receipt.jpg';
    const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

    const form = new FormData();
    form.append('accountId', payload.accountId);
    form.append('categoryId', payload.categoryId);
    form.append('type', payload.type);
    form.append('amount', String(payload.amount));
    form.append('description', payload.description);
    form.append('date', payload.date);
    form.append('source', 'mobile');
    form.append('attachment', { uri: receiptUri, name: filename, type: mimeType } as unknown as Blob);

    const response = await api.post<Transaction>('/transactions', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  const response = await api.post<Transaction>('/transactions', { ...payload, source: 'mobile' });
  return response.data;
}

export async function getFamily(): Promise<Family> {
  const response = await api.get<Family>('/family');
  return response.data;
}

export async function getFamilyMembers(): Promise<FamilyMember[]> {
  const response = await api.get<FamilyMember[]>('/family/members');
  return response.data;
}

export async function joinFamily(familyId: string): Promise<void> {
  await api.post('/family/join', { family_id: familyId });
}

export async function leaveFamily(): Promise<void> {
  await api.post('/family/leave');
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
  const response = await api.get<{ data: Goal[] } | Goal[]>('/goals');

  const result = response.data;

  if (Array.isArray(result)) {
    return result;
  }

  return result.data ?? [];
}

export async function createGoal(payload: CreateGoalPayload): Promise<Goal> {
  const response = await api.post<Goal>('/goals', payload);

  return response.data;
}

export async function updateGoal(id: string, payload: Partial<CreateGoalPayload>): Promise<Goal> {
  const response = await api.put<Goal>(`/goals/${id}`, payload);

  return response.data;
}

export async function deleteGoal(id: string): Promise<void> {
  await api.delete(`/goals/${id}`);
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
