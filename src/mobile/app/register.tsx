import axios from 'axios';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { Screen } from '../src/components/Screen';
import { useTheme } from '../src/context/ThemeContext';
import { register, saveAuthToken } from '../src/services/api';
import { radius, spacing, typography } from '../src/theme/theme';
import { getApiErrorMessage } from '../src/utils/api-error';

export default function RegisterScreen() {
  const { colors } = useTheme();
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
      if (axios.isAxiosError(requestError) && !requestError.response) {
        await saveAuthToken('mock-token');
        router.replace('/dashboard');
        return;
      }
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Screen title="Criar conta" subtitle="Cria o usuário e a família inicial no backend Laravel.">
      <View style={[styles.form, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text }]}>Nome</Text>
        <TextInput
          onChangeText={setName}
          placeholder="Seu nome"
          placeholderTextColor={colors.mutedLight}
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
          value={name}
        />

        <Text style={[styles.label, { color: colors.text }]}>E-mail</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="email@exemplo.com"
          placeholderTextColor={colors.mutedLight}
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
          value={email}
        />

        <Text style={[styles.label, { color: colors.text }]}>Senha</Text>
        <TextInput
          onChangeText={setPassword}
          placeholder="Mínimo de 8 caracteres"
          placeholderTextColor={colors.mutedLight}
          secureTextEntry
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
          value={password}
        />

        {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

        <AppButton disabled={isLoading} label={isLoading ? 'Criando...' : 'Criar conta'} onPress={handleRegister} />
        <AppButton label="Voltar para login" onPress={() => router.back()} variant="secondary" />
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
  error: {
    fontSize: typography.small,
    lineHeight: 20,
  },
});
