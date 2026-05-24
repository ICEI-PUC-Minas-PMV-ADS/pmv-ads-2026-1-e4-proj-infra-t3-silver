import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { InfoCard } from '../src/components/InfoCard';
import { Screen } from '../src/components/Screen';
import { API_BASE_URL, clearAuthToken, getMe } from '../src/services/api';
import { colors, spacing, typography } from '../src/theme/theme';
import { User } from '../src/types/financial';
import { getApiErrorMessage } from '../src/utils/api-error';

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    setError('');
    setIsLoading(true);

    try {
      setUser(await getMe());
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadProfile();
    }, [loadProfile]),
  );

  async function handleLogout() {
    await clearAuthToken();
    router.replace('/login');
  }

  return (
    <Screen title="Perfil" subtitle="Dados vindos de GET /api/me usando o Bearer Token salvo no login.">
      <InfoCard title="Usuario autenticado">
        {isLoading ? <Text style={styles.muted}>Carregando perfil...</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {user ? (
          <View style={styles.profile}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.muted}>{user.email}</Text>
            <Text style={styles.muted}>Familia: {user.familyId ?? 'Nao informado'}</Text>
          </View>
        ) : null}
      </InfoCard>

      <AppButton label="Atualizar perfil" onPress={loadProfile} variant="secondary" />
      <AppButton label="Sair" onPress={handleLogout} />
      <Text style={styles.apiUrl}>API: {API_BASE_URL}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: {
    color: colors.danger,
    fontSize: typography.small,
    lineHeight: 20,
  },
  muted: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  name: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '700',
  },
  profile: {
    gap: spacing.xs,
  },
  apiUrl: {
    color: colors.muted,
    fontSize: typography.small,
    lineHeight: 20,
  },
});
