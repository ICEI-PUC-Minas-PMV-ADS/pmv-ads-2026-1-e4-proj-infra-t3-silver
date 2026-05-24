import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { Screen } from '../src/components/Screen';
import { mockUser } from '../src/mocks/financial-data';
import { API_BASE_URL, login } from '../src/services/api';
import { colors, radius, spacing, typography } from '../src/theme/theme';
import { getApiErrorMessage } from '../src/utils/api-error';

export default function LoginScreen() {
  const [email, setEmail] = useState(mockUser.email);
  const [password, setPassword] = useState('12345678');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    setError('');
    setIsLoading(true);

    try {
      await login(email.trim(), password);
      router.replace('/dashboard');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Screen title="Silver" subtitle="Entre com sua conta para acessar o controle financeiro da familia.">
      <View style={styles.form}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="email@exemplo.com"
          style={styles.input}
          value={email}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput onChangeText={setPassword} placeholder="********" secureTextEntry style={styles.input} value={password} />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <AppButton disabled={isLoading} label={isLoading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} />
        <AppButton label="Criar conta" onPress={() => router.push('/register')} variant="secondary" />
        <Text style={styles.note}>API: {API_BASE_URL}</Text>
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
  error: {
    color: colors.danger,
    fontSize: typography.small,
    lineHeight: 20,
  },
});
