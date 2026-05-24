import { router } from 'expo-router';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { Screen } from '../src/components/Screen';
import { mockUser } from '../src/mocks/financial-data';
import { colors, radius, spacing, typography } from '../src/theme/theme';

export default function LoginScreen() {
  return (
    <Screen title="Silver" subtitle="Controle financeiro domestico para organizar contas, metas e gastos da familia.">
      <View style={styles.form}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="email@exemplo.com"
          style={styles.input}
          value={mockUser.email}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput placeholder="********" secureTextEntry style={styles.input} value="12345678" />

        <AppButton label="Entrar com dados mockados" onPress={() => router.replace('/dashboard')} />
        <Text style={styles.note}>Depois, esta tela deve chamar POST /api/login e salvar o Bearer Token.</Text>
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
  note: {
    color: colors.muted,
    fontSize: typography.small,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
});
