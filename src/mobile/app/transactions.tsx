import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { Screen } from '../src/components/Screen';
import { useTheme } from '../src/context/ThemeContext';
import { getCategories, getTransactions } from '../src/services/api';
import { radius, spacing, typography } from '../src/theme/theme';
import { Category, Transaction } from '../src/types/financial';
import { formatCurrency, formatDate } from '../src/utils/formatters';

export default function TransactionsScreen() {
  const { colors } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      Promise.all([getTransactions(), getCategories()])
        .then(([txs, cats]) => {
          setTransactions(txs);
          setCategories(cats);
        })
        .catch(() => setError('Não foi possível carregar as transações.'))
        .finally(() => setIsLoading(false));
    }, [])
  );

  function getCategoryName(categoryId: string): string {
    const cat = categories.find((c) => String(c._id ?? c.id) === String(categoryId));
    return cat?.name ?? 'Sem categoria';
  }

  function handleOpen(transaction: Transaction) {
    const id = String(transaction._id ?? transaction.id);
    router.push(`/transaction-detail?id=${id}`);
  }

  return (
    <Screen title="Transações">
      <AppButton label="Cadastrar transação" onPress={() => router.push('/transaction-new')} />

      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

      {!isLoading && transactions.length === 0 && !error ? (
        <Text style={[styles.empty, { color: colors.muted }]}>Nenhuma transação cadastrada ainda.</Text>
      ) : null}

      {transactions.map((transaction) => {
        const id = String(transaction._id ?? transaction.id);
        const isIncome = transaction.type === 'income';
        return (
          <Pressable key={id} onPress={() => handleOpen(transaction)} style={[styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.accent, { backgroundColor: isIncome ? colors.success : colors.danger }]} />
            <View style={styles.content}>
              <Text style={[styles.description, { color: colors.text }]}>{transaction.description}</Text>
              <Text style={[styles.meta, { color: colors.muted }]}>
                {getCategoryName(transaction.categoryId)} · {formatDate(transaction.date)}
              </Text>
            </View>
            <View style={styles.right}>
              <Text style={[styles.amount, { color: isIncome ? colors.success : colors.danger }]}>
                {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
              </Text>
              {transaction.attachmentUrl ? <Text style={styles.attachment}>📎</Text> : null}
            </View>
          </Pressable>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  accent: {
    borderRadius: radius.sm,
    height: 36,
    width: 6,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  description: {
    fontSize: typography.body,
    fontWeight: '700',
  },
  meta: {
    fontSize: typography.small,
  },
  right: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  amount: {
    fontSize: typography.small,
    fontWeight: '700',
  },
  attachment: {
    fontSize: 12,
  },
  empty: {
    fontSize: typography.body,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  error: {
    fontSize: typography.small,
  },
});
