import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { ReceiptPicker } from '../src/components/ReceiptPicker';
import { Screen } from '../src/components/Screen';
import { useTheme } from '../src/context/ThemeContext';
import { useCategories } from '../src/hooks/useCategories';
import { createTransaction, getAccounts } from '../src/services/api';
import { radius, spacing, typography } from '../src/theme/theme';
import { Account, TransactionType } from '../src/types/financial';
import { getApiErrorMessage } from '../src/utils/api-error';
import { formatCurrency } from '../src/utils/formatters';

export default function TransactionNewScreen() {
  const { colors } = useTheme();
  const { categories } = useCategories();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [receiptUri, setReceiptUri] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  const today = new Date().toISOString().split('T')[0];
  const defaultCategory =
    type === 'income'
      ? categories.find((c) => c.kind === 'income' || c.kind === 'both')!
      : categories.find((c) => c.kind === 'expense' || c.kind === 'both')!;

  useEffect(() => {
    getAccounts()
      .then((data) => { setAccounts(data); if (data.length > 0) setSelectedAccount(data[0]); })
      .catch(() => setError('Não foi possível carregar as contas.'))
      .finally(() => setIsLoadingAccounts(false));
  }, []);

  async function handleSave() {
    if (!selectedAccount) { setError('Nenhuma conta encontrada. Crie uma conta antes de lançar transações.'); return; }
    if (!description.trim()) { setError('Informe a descrição.'); return; }
    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) { setError('Informe um valor válido.'); return; }
    setError('');
    setIsLoading(true);
    try {
      await createTransaction(
        { description: description.trim(), amount: parsedAmount, type, date: today,
          accountId: String(selectedAccount._id ?? selectedAccount.id),
          categoryId: String(defaultCategory.id) },
        receiptUri ?? undefined
      );
      router.back();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  function renderAccountSelector() {
    if (isLoadingAccounts) return <ActivityIndicator color={colors.primary} />;
    if (accounts.length === 0) return <Text style={[styles.preview, { backgroundColor: colors.background, color: colors.muted }]}>Nenhuma conta cadastrada</Text>;
    if (accounts.length === 1) return <Text style={[styles.preview, { backgroundColor: colors.background, color: colors.text }]}>{accounts[0].name}</Text>;

    return (
      <View style={styles.accountList}>
        {accounts.map((account) => {
          const id = String(account._id ?? account.id);
          const selectedId = String(selectedAccount?._id ?? selectedAccount?.id);
          const isSelected = id === selectedId;
          return (
            <Pressable
              key={id}
              onPress={() => setSelectedAccount(account)}
              style={[
                styles.accountOption,
                { borderColor: colors.border },
                isSelected && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
            >
              <Text style={[styles.accountOptionName, { color: isSelected ? '#ffffff' : colors.text }]}>{account.name}</Text>
              <Text style={[styles.accountOptionBalance, { color: isSelected ? '#ffffffaa' : colors.muted }]}>{formatCurrency(account.balance)}</Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  return (
    <Screen title="Nova transação">
      <View style={[styles.form, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text }]}>Tipo</Text>
        <View style={[styles.typeToggle, { borderColor: colors.border }]}>
          {(['expense', 'income'] as TransactionType[]).map((t) => (
            <Pressable
              key={t}
              onPress={() => setType(t)}
              style={[styles.typeButton, type === t && { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.typeText, { color: type === t ? '#ffffff' : colors.muted }]}>
                {t === 'expense' ? 'Despesa' : 'Receita'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Descrição</Text>
        <TextInput
          onChangeText={setDescription}
          placeholder="Ex.: Conta de energia"
          placeholderTextColor={colors.mutedLight}
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
          value={description}
        />

        <Text style={[styles.label, { color: colors.text }]}>Valor</Text>
        <TextInput
          keyboardType="decimal-pad"
          onChangeText={setAmount}
          placeholder="0,00"
          placeholderTextColor={colors.mutedLight}
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
          value={amount}
        />

        <Text style={[styles.label, { color: colors.text }]}>Conta</Text>
        {renderAccountSelector()}

        <Text style={[styles.label, { color: colors.text }]}>Categoria</Text>
        <Text style={[styles.preview, { backgroundColor: colors.background, color: colors.text }]}>{defaultCategory.name}</Text>

        <ReceiptPicker onChange={setReceiptUri} uri={receiptUri} />

        {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

        <AppButton disabled={isLoading || isLoadingAccounts} label={isLoading ? 'Salvando...' : 'Salvar'} onPress={handleSave} />
        <AppButton label="Cancelar" onPress={() => router.back()} variant="secondary" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  label: {
    fontSize: typography.small,
    fontWeight: '700',
  },
  input: {
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: typography.body,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  preview: {
    borderRadius: radius.md,
    fontSize: typography.body,
    minHeight: 44,
    padding: spacing.md,
  },
  typeToggle: {
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
  typeText: {
    fontSize: typography.small,
    fontWeight: '600',
  },
  accountList: {
    gap: spacing.xs,
  },
  accountOption: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  accountOptionName: {
    fontSize: typography.small,
    fontWeight: '600',
  },
  accountOptionBalance: {
    fontSize: typography.small,
  },
  error: {
    fontSize: typography.small,
  },
});
