import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { Screen } from '../src/components/Screen';
import { createAccount } from '../src/services/api';
import { colors, radius, spacing, typography } from '../src/theme/theme';
import { AccountType } from '../src/types/financial';
import { getApiErrorMessage } from '../src/utils/api-error';

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: 'checking', label: 'Conta corrente' },
  { value: 'savings', label: 'Poupança' },
  { value: 'investment', label: 'Investimento' },
  { value: 'cash', label: 'Dinheiro' },
];

export default function AccountNewScreen() {
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('checking');
  const [balance, setBalance] = useState('0');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSave() {
    if (!name.trim()) {
      setError('Informe o nome da conta.');
      return;
    }
    const parsedBalance = parseFloat(balance.replace(',', '.'));
    if (isNaN(parsedBalance)) {
      setError('Informe um saldo inicial válido.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await createAccount({ name: name.trim(), type, balance: parsedBalance });
      router.back();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Screen title="Nova conta">
      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          onChangeText={setName}
          placeholder="Ex.: Nubank, Carteira"
          style={styles.input}
          value={name}
        />

        <Text style={styles.label}>Tipo</Text>
        <View style={styles.typeGrid}>
          {ACCOUNT_TYPES.map((item) => (
            <Pressable
              key={item.value}
              onPress={() => setType(item.value)}
              style={[styles.typeOption, type === item.value && styles.typeOptionActive]}
            >
              <Text style={[styles.typeOptionText, type === item.value && styles.typeOptionTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Saldo inicial</Text>
        <TextInput
          keyboardType="decimal-pad"
          onChangeText={setBalance}
          placeholder="0,00"
          style={styles.input}
          value={balance}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <AppButton disabled={isLoading} label={isLoading ? 'Salvando...' : 'Salvar'} onPress={handleSave} />
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeOption: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  typeOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeOptionText: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: '600',
  },
  typeOptionTextActive: {
    color: colors.surface,
  },
  error: {
    color: colors.danger,
    fontSize: typography.small,
  },
});
