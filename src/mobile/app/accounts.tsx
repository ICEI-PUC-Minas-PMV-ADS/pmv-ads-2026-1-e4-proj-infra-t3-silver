import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../src/components/Screen';
import { useTheme } from '../src/context/ThemeContext';
import { deleteAccount, getAccounts } from '../src/services/api';
import { radius, spacing, typography } from '../src/theme/theme';
import { Account } from '../src/types/financial';
import { formatCurrency } from '../src/utils/formatters';

const ACCOUNT_TYPE_LABEL: Record<string, string> = {
  checking: 'Conta corrente',
  savings: 'Poupança',
  investment: 'Investimento',
  cash: 'Dinheiro',
};

export default function AccountsScreen() {
  const { colors } = useTheme();
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
      <Pressable onPress={() => router.push('/account-new')} style={[styles.addButton, { backgroundColor: colors.primary }]}>
        <Text style={[styles.addButtonText, { color: '#ffffff' }]}>+ Nova conta</Text>
      </Pressable>

      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

      {!isLoading && accounts.length === 0 && !error ? (
        <Text style={[styles.empty, { color: colors.muted }]}>Nenhuma conta cadastrada. Toque em "Nova conta" para começar.</Text>
      ) : null}

      {accounts.map((account) => {
        const id = String(account._id ?? account.id);
        const isNegative = account.balance < 0;
        return (
          <View key={id} style={[styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.accent, { backgroundColor: isNegative ? colors.danger : colors.primary }]} />
            <View style={styles.content}>
              <Text style={[styles.accountName, { color: colors.text }]}>{account.name}</Text>
              <Text style={[styles.accountType, { color: colors.muted }]}>{ACCOUNT_TYPE_LABEL[account.type] ?? account.type}</Text>
            </View>
            <Text style={[styles.balance, { color: isNegative ? colors.danger : colors.text }]}>
              {formatCurrency(account.balance)}
            </Text>
            <Pressable onPress={() => confirmDelete(account)} style={styles.deleteButton}>
              <Text style={[styles.deleteText, { color: colors.danger }]}>Excluir</Text>
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
    borderRadius: radius.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: typography.body,
    fontWeight: '700',
  },
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
  accountName: {
    fontSize: typography.body,
    fontWeight: '700',
  },
  accountType: {
    fontSize: typography.small,
  },
  balance: {
    fontSize: typography.small,
    fontWeight: '700',
  },
  deleteButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  deleteText: {
    fontSize: typography.small,
    fontWeight: '600',
  },
  empty: {
    fontSize: typography.body,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  error: {
    fontSize: typography.small,
  },
});
