import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { Screen } from '../src/components/Screen';
import { mockAccounts, mockCategories } from '../src/mocks/financial-data';
import { colors, radius, spacing, typography } from '../src/theme/theme';

export default function TransactionNewScreen() {
  return (
    <Screen title="Nova transacao" subtitle="Formulario visual mockado. Depois, enviar para POST /api/transactions.">
      <View style={styles.form}>
        <Text style={styles.label}>Descricao</Text>
        <TextInput placeholder="Ex.: Conta de energia" style={styles.input} />

        <Text style={styles.label}>Valor</Text>
        <TextInput keyboardType="decimal-pad" placeholder="0,00" style={styles.input} />

        <Text style={styles.label}>Conta</Text>
        <Text style={styles.preview}>{mockAccounts[0].name}</Text>

        <Text style={styles.label}>Categoria</Text>
        <Text style={styles.preview}>{mockCategories[1].name}</Text>

        <AppButton label="Salvar rascunho mockado" onPress={() => undefined} />
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
  input: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: typography.body,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  label: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
  },
  preview: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    color: colors.text,
    fontSize: typography.body,
    minHeight: 44,
    padding: spacing.md,
  },
});
