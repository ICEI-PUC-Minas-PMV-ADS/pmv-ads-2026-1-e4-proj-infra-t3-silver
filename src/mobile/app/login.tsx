import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { Screen } from '../src/components/Screen';
import { mockUser } from '../src/mocks/financial-data';
import { API_BASE_URL, login } from '../src/services/api';
import {
  authenticateWithBiometric,
  getBiometricCredentials,
  hasBiometricCredentials,
  isBiometricAvailable,
  saveBiometricCredentials,
} from '../src/services/biometric';
import { colors, radius, spacing, typography } from '../src/theme/theme';
import { getApiErrorMessage } from '../src/utils/api-error';

export default function LoginScreen() {
  const [email, setEmail] = useState(mockUser.email);
  const [password, setPassword] = useState('12345678');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);

  useEffect(() => {
    checkBiometricOption();
  }, []);

  async function checkBiometricOption() {
    const available = await isBiometricAvailable();
    const hasCredentials = await hasBiometricCredentials();
    setShowBiometric(available && hasCredentials);
  }

  async function handleLogin() {
    setError('');
    setIsLoading(true);

    try {
      await login(email.trim(), password);
      await offerBiometricSetup(email.trim(), password);
      router.replace('/dashboard');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  async function offerBiometricSetup(userEmail: string, userPassword: string) {
    const available = await isBiometricAvailable();
    const hasCredentials = await hasBiometricCredentials();
    if (!available || hasCredentials) return;

    return new Promise<void>((resolve) => {
      Alert.alert(
        'Ativar biometria',
        'Deseja usar Face ID ou digital para entrar nas próximas vezes?',
        [
          { text: 'Não', style: 'cancel', onPress: () => resolve() },
          {
            text: 'Sim',
            onPress: async () => {
              await saveBiometricCredentials(userEmail, userPassword);
              resolve();
            },
          },
        ]
      );
    });
  }

  async function handleBiometricLogin() {
    setError('');
    setIsLoading(true);

    try {
      const authenticated = await authenticateWithBiometric();
      if (!authenticated) {
        setError('Autenticação biométrica cancelada.');
        return;
      }

      const credentials = await getBiometricCredentials();
      if (!credentials) {
        setError('Credenciais biométricas não encontradas. Faça login com e-mail e senha.');
        setShowBiometric(false);
        return;
      }

      await login(credentials.email, credentials.password);
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

        {showBiometric && (
          <AppButton
            disabled={isLoading}
            label="Entrar com biometria"
            onPress={handleBiometricLogin}
            variant="secondary"
          />
        )}

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
