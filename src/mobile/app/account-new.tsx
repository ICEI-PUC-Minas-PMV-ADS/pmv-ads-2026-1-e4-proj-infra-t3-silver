import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { Screen } from '../src/components/Screen';
import { useTheme } from '../src/context/ThemeContext';
import { createAccount } from '../src/services/api';
import { radius, spacing, typography } from '../src/theme/theme';
import { AccountType } from '../src/types/financial';
import { getApiErrorMessage } from '../src/utils/api-error';

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: 'checking', label: 'Conta corrente' },
  { value: 'savings', label: 'Poupança' },
  { value: 'investment', label: 'Investimento' },
  { value: 'cash', label: 'Dinheiro' },
];

export default function AccountNewScreen() {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('checking');
  const [balance, setBalance] = useState('0');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSave() {
    if (!name.trim()) { setError('Informe o nome da conta.'); return; }
    const parsedBalance = parseFloat(balance.replace(',', '.'));
    if (isNaN(parsedBalance)) { setError('Informe um saldo inicial válido.'); return; }
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
      <View style={[styles.form, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text }]}>Nome</Text>
        <TextInput
          onChangeText={setName}
          placeholder="Ex.: Nubank, Carteira"
          placeholderTextColor={colors.mutedLight}
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
          value={name}
        />

        <Text style={[styles.label, { color: colors.text }]}>Tipo</Text>
        <View style={styles.typeGrid}>
          {ACCOUNT_TYPES.map((item) => (
            <Pressable
              key={item.value}
              onPress={() => setType(item.value)}
              style={[
                styles.typeOption,
                { borderColor: colors.border },
                type === item.value && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
            >
              <Text style={[
                styles.typeOptionText,
                { color: type === item.value ? '#ffffff' : colors.muted },
              ]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Saldo inicial</Text>
        <TextInput
          keyboardType="decimal-pad"
          onChangeText={setBalance}
          placeholder="0,00"
          placeholderTextColor={colors.mutedLight}
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
          value={balance}
        />

        {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

        <AppButton disabled={isLoading} label={isLoading ? 'Salvando...' : 'Salvar'} onPress={handleSave} />
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeOption: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  typeOptionText: {
    fontSize: typography.small,
    fontWeight: '600',
  },
  error: {
    fontSize: typography.small,
  },
});
