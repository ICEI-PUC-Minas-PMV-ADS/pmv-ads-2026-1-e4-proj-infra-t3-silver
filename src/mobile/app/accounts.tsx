import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../src/components/Screen';
import { deleteAccount, getAccounts } from '../src/services/api';
import { colors, radius, spacing, typography } from '../src/theme/theme';
import { Account } from '../src/types/financial';
import { formatCurrency } from '../src/utils/formatters';

const ACCOUNT_TYPE_LABEL: Record<string, string> = {
  checking: 'Conta corrente',
  savings: 'Poupança',
  investment: 'Investimento',
  cash: 'Dinheiro',
};

export default function AccountsScreen() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      getAccounts()
        .then(setAccounts)
        .catch(() => setError('Não foi possível carregar as contas.'))
        .finally(() => setIsLoading(false));
    }, [])
  );

  function confirmDelete(account: Account) {
    Alert.alert('Excluir conta', `Deseja excluir "${account.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const id = String(account._id ?? account.id);
          await deleteAccount(id);
          setAccounts((prev) => prev.filter((a) => String(a._id ?? a.id) !== id));
        },
      },
    ]);
  }

  return (
    <Screen title="Contas">
      <Pressable onPress={() => router.push('/account-new')} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Nova conta</Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!isLoading && accounts.length === 0 && !error ? (
        <Text style={styles.empty}>Nenhuma conta cadastrada. Toque em "Nova conta" para começar.</Text>
      ) : null}

      {accounts.map((account) => {
        const id = String(account._id ?? account.id);
        const isNegative = account.balance < 0;
        return (
          <View key={id} style={styles.item}>
            <View style={[styles.accent, { backgroundColor: isNegative ? colors.danger : colors.primary }]} />
            <View style={styles.content}>
              <Text style={styles.accountName}>{account.name}</Text>
              <Text style={styles.accountType}>{ACCOUNT_TYPE_LABEL[account.type] ?? account.type}</Text>
            </View>
            <Text style={[styles.balance, isNegative && styles.balanceNegative]}>
              {formatCurrency(account.balance)}
            </Text>
            <Pressable onPress={() => confirmDelete(account)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Excluir</Text>
            </Pressable>
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: '700',
  },
  item: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
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
  accountName: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  accountType: {
    color: colors.muted,
    fontSize: typography.small,
  },
  balance: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
  },
  balanceNegative: {
    color: colors.danger,
  },
  deleteButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  deleteText: {
    color: colors.danger,
    fontSize: typography.small,
    fontWeight: '600',
  },
  empty: {
    color: colors.muted,
    fontSize: typography.body,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  error: {
    color: colors.danger,
    fontSize: typography.small,
  },
});
