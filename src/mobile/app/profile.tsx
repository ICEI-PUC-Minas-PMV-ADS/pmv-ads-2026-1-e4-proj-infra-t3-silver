import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { InfoCard } from '../src/components/InfoCard';
import { Screen } from '../src/components/Screen';
import { ThemeScheme, useTheme } from '../src/context/ThemeContext';
import { API_BASE_URL, clearAuthToken, getMe } from '../src/services/api';
import { radius, spacing, typography } from '../src/theme/theme';
import { User } from '../src/types/financial';
import { getApiErrorMessage } from '../src/utils/api-error';

const THEME_OPTIONS: { value: ThemeScheme; label: string }[] = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
  { value: 'system', label: 'Sistema' },
];

export default function ProfileScreen() {
  const { colors, scheme, setScheme } = useTheme();
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
    <Screen title="Perfil">
      <InfoCard title="Usuario autenticado">
        {isLoading ? <Text style={[styles.muted, { color: colors.muted }]}>Carregando perfil...</Text> : null}
        {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
        {user ? (
          <View style={styles.profile}>
            <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
            <Text style={[styles.muted, { color: colors.muted }]}>{user.email}</Text>
            <Text style={[styles.muted, { color: colors.muted }]}>Familia: {user.familyId ?? 'Nao informado'}</Text>
          </View>
        ) : null}
      </InfoCard>

      <InfoCard title="Aparência">
        <View style={styles.themeRow}>
          {THEME_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setScheme(option.value)}
              style={[
                styles.themeButton,
                { borderColor: colors.border },
                scheme === option.value && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
            >
              <Text style={[styles.themeButtonText, { color: scheme === option.value ? '#ffffff' : colors.muted }]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </InfoCard>

      <AppButton label="Atualizar perfil" onPress={loadProfile} variant="secondary" />
      <AppButton label="Sair" onPress={handleLogout} />
      <Text style={[styles.apiUrl, { color: colors.muted }]}>API: {API_BASE_URL}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: {
    fontSize: typography.small,
    lineHeight: 20,
  },
  muted: {
    fontSize: typography.body,
    lineHeight: 22,
  },
  name: {
    fontSize: typography.subtitle,
    fontWeight: '700',
  },
  profile: {
    gap: spacing.xs,
  },
  apiUrl: {
    fontSize: typography.small,
    lineHeight: 20,
  },
  themeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  themeButton: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    paddingVertical: spacing.sm,
  },
  themeButtonText: {
    fontSize: typography.small,
    fontWeight: '600',
  },
});
