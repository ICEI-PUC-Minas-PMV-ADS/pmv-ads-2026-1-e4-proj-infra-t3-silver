import { useCallback, useEffect, useReducer } from 'react';

import {
  addMockCategory,
  deleteMockCategory,
  mockCategories,
  updateMockCategory,
} from '../mocks/financial-data';
import { Category, CategoryKind } from '../types/financial';

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useCategories() {
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    const unsub = subscribe(forceUpdate);
    return unsub;
  }, [forceUpdate]);

  const addCategory = useCallback((name: string, kind: CategoryKind, color: string, icon?: string) => {
    const created = addMockCategory({ name, kind, color, icon });
    notifyListeners();
    return created;
  }, []);

  const updateCategory = useCallback((id: string | number, updates: Partial<Omit<Category, 'id'>>) => {
    const updated = updateMockCategory(id, updates);
    notifyListeners();
    return updated;
  }, []);

  const removeCategory = useCallback((id: string | number) => {
    const removed = deleteMockCategory(id);
    notifyListeners();
    return removed;
  }, []);

  return {
    categories: mockCategories,
    addCategory,
    updateCategory,
    removeCategory,
  };
}
