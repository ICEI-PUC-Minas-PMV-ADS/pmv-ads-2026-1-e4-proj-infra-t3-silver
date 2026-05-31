import { Stack } from 'expo-router';

import { ThemeProvider, useTheme } from '../src/context/ThemeContext';

function RootStack() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Criar conta' }} />
      <Stack.Screen name="dashboard" options={{ title: 'Painel' }} />
      <Stack.Screen name="profile" options={{ title: 'Perfil' }} />
      <Stack.Screen name="transactions" options={{ title: 'Transações' }} />
      <Stack.Screen name="transaction-new" options={{ title: 'Nova transação' }} />
      <Stack.Screen name="transaction-detail" options={{ title: 'Detalhes' }} />
      <Stack.Screen name="accounts" options={{ title: 'Contas' }} />
      <Stack.Screen name="family" options={{ title: 'Família' }} />
      <Stack.Screen name="account-new" options={{ title: 'Nova conta' }} />
      <Stack.Screen name="categories" options={{ title: 'Categorias' }} />
      <Stack.Screen name="category-new" options={{ title: 'Nova categoria' }} />
      <Stack.Screen name="category-edit" options={{ title: 'Editar categoria' }} />
      <Stack.Screen name="budgets" options={{ title: 'Orçamentos' }} />
      <Stack.Screen name="goals" options={{ title: 'Metas' }} />
      <Stack.Screen name="history" options={{ title: 'Histórico' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );
}
