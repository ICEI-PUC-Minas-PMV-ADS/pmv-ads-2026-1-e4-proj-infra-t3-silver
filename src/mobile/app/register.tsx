import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { Screen } from '../src/components/Screen';
import { register } from '../src/services/api';
import { colors, radius, spacing, typography } from '../src/theme/theme';
import { getApiErrorMessage } from '../src/utils/api-error';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister() {
    setError('');
    setIsLoading(true);

    try {
      await register(name.trim(), email.trim(), password);
      router.replace('/dashboard');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Screen title="Criar conta" subtitle="Cria o usuario e a familia inicial no backend Laravel.">
      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput onChangeText={setName} placeholder="Seu nome" style={styles.input} value={name} />

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
        <TextInput
          onChangeText={setPassword}
          placeholder="Minimo de 8 caracteres"
          secureTextEntry
          style={styles.input}
          value={password}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <AppButton disabled={isLoading} label={isLoading ? 'Criando...' : 'Criar conta'} onPress={handleRegister} />
        <AppButton label="Voltar para login" onPress={() => router.back()} variant="secondary" />
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
  error: {
    color: colors.danger,
    fontSize: typography.small,
    lineHeight: 20,
  },
});
