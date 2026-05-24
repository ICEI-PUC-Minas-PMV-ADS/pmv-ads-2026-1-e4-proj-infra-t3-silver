import { Stack } from 'expo-router';

import { colors } from '../src/theme/theme';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Stack.Screen name="transactions" options={{ title: 'Transacoes' }} />
      <Stack.Screen name="transaction-new" options={{ title: 'Nova transacao' }} />
      <Stack.Screen name="accounts" options={{ title: 'Contas' }} />
      <Stack.Screen name="categories" options={{ title: 'Categorias' }} />
      <Stack.Screen name="budgets" options={{ title: 'Orcamentos' }} />
      <Stack.Screen name="goals" options={{ title: 'Metas' }} />
      <Stack.Screen name="history" options={{ title: 'Historico' }} />
    </Stack>
  );
}
