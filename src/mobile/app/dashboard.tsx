import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { InfoCard } from '../src/components/InfoCard';
import { ListItem } from '../src/components/ListItem';
import { Screen } from '../src/components/Screen';
import { mockAccounts, mockTransactions, mockUser } from '../src/mocks/financial-data';
import { getMe } from '../src/services/api';
import { spacing } from '../src/theme/theme';
import { User } from '../src/types/financial';
import { formatCurrency, formatDate } from '../src/utils/formatters';

export default function DashboardScreen() {
  const [user, setUser] = useState<User>(mockUser);
  const totalBalance = mockAccounts.reduce((total, account) => total + account.balance, 0);
  const monthlyIncome = mockTransactions.filter((item) => item.type === 'income').reduce((total, item) => total + item.amount, 0);
  const monthlyExpenses = mockTransactions.filter((item) => item.type === 'expense').reduce((total, item) => total + item.amount, 0);

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(mockUser));
  }, []);

  return (
    <Screen title={`Olá, ${user.name}`} subtitle="Resumo financeiro mockado para a primeira entrega mobile.">
      <View style={styles.grid}>
        <InfoCard title="Saldo consolidado" value={formatCurrency(totalBalance)} tone={totalBalance >= 0 ? 'success' : 'danger'} />
        <InfoCard title="Entradas do mês" value={formatCurrency(monthlyIncome)} tone="success" />
        <InfoCard title="Saídas do mês" value={formatCurrency(monthlyExpenses)} tone="danger" />
      </View>

      <View style={styles.actions}>
        <AppButton label="Transações" onPress={() => router.push('/transactions')} />
        <AppButton label="Nova transação" onPress={() => router.push('/transaction-new')} variant="secondary" />
        <AppButton label="Perfil" onPress={() => router.push('/profile')} variant="secondary" />
        <AppButton label="Contas" onPress={() => router.push('/accounts')} variant="secondary" />
        <AppButton label="Família" onPress={() => router.push('/family')} variant="secondary" />
        <AppButton label="Categorias" onPress={() => router.push('/categories')} variant="secondary" />
        <AppButton label="Orçamentos" onPress={() => router.push('/budgets')} variant="secondary" />
        <AppButton label="Metas" onPress={() => router.push('/goals')} variant="secondary" />
        <AppButton label="Histórico" onPress={() => router.push('/history')} variant="secondary" />
      </View>

      <InfoCard title="Últimas movimentações">
        {mockTransactions.slice(0, 3).map((transaction) => (
          <ListItem
            key={transaction.id}
            amount={formatCurrency(transaction.amount)}
            description={formatDate(transaction.date)}
            title={transaction.description}
          />
        ))}
      </InfoCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm,
  },
  grid: {
    gap: spacing.sm,
  },
});
