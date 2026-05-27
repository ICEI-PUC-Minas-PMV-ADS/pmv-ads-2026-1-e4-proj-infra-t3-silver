import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { ReceiptPicker } from '../src/components/ReceiptPicker';
import { Screen } from '../src/components/Screen';
import { mockCategories } from '../src/mocks/financial-data';
import { createTransaction, getAccounts } from '../src/services/api';
import { colors, radius, spacing, typography } from '../src/theme/theme';
import { Account, TransactionType } from '../src/types/financial';
import { getApiErrorMessage } from '../src/utils/api-error';

export default function TransactionNewScreen() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [receiptUri, setReceiptUri] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  const today = new Date().toISOString().split('T')[0];
  const defaultAccount = accounts[0] ?? null;
  const defaultCategory =
    type === 'income'
      ? mockCategories.find((c) => c.kind === 'income' || c.kind === 'both')!
      : mockCategories.find((c) => c.kind === 'expense' || c.kind === 'both')!;

  useEffect(() => {
    getAccounts()
      .then(setAccounts)
      .catch(() => setError('Não foi possível carregar as contas.'))
      .finally(() => setIsLoadingAccounts(false));
  }, []);

  async function handleSave() {
    if (!defaultAccount) {
      setError('Nenhuma conta encontrada. Crie uma conta antes de lançar transações.');
      return;
    }
    if (!description.trim()) {
      setError('Informe a descrição.');
      return;
    }
    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Informe um valor válido.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await createTransaction(
        {
          description: description.trim(),
          amount: parsedAmount,
          type,
          date: today,
          accountId: String(defaultAccount.id),
          categoryId: String(defaultCategory.id),
        },
        receiptUri ?? undefined
      );

      router.back();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Screen title="Nova transação">
      <View style={styles.form}>
        <Text style={styles.label}>Tipo</Text>
        <View style={styles.typeToggle}>
          <Pressable
            onPress={() => setType('expense')}
            style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
          >
            <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>Despesa</Text>
          </Pressable>
          <Pressable
            onPress={() => setType('income')}
            style={[styles.typeButton, type === 'income' && styles.typeButtonActive]}
          >
            <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>Receita</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          onChangeText={setDescription}
          placeholder="Ex.: Conta de energia"
          style={styles.input}
          value={description}
        />

        <Text style={styles.label}>Valor</Text>
        <TextInput
          keyboardType="decimal-pad"
          onChangeText={setAmount}
          placeholder="0,00"
          style={styles.input}
          value={amount}
        />

        <Text style={styles.label}>Conta</Text>
        {isLoadingAccounts ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.preview}>{defaultAccount?.name ?? 'Nenhuma conta cadastrada'}</Text>
        )}

        <Text style={styles.label}>Categoria</Text>
        <Text style={styles.preview}>{defaultCategory.name}</Text>

        <ReceiptPicker onChange={setReceiptUri} uri={receiptUri} />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <AppButton
          disabled={isLoading || isLoadingAccounts}
          label={isLoading ? 'Salvando...' : 'Salvar'}
          onPress={handleSave}
        />
        <AppButton label="Cancelar" onPress={() => router.back()} variant="secondary" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  label: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
  },
  input: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.body,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  preview: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    color: colors.text,
    fontSize: typography.body,
    minHeight: 44,
    padding: spacing.md,
  },
  typeToggle: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  typeButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: spacing.sm,
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
  },
  typeText: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: '600',
  },
  typeTextActive: {
    color: colors.surface,
  },
  error: {
    color: colors.danger,
    fontSize: typography.small,
  },
});
