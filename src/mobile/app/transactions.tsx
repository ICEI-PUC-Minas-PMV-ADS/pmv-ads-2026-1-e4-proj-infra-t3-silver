import { router } from 'expo-router';

import { AppButton } from '../src/components/AppButton';
import { ListItem } from '../src/components/ListItem';
import { Screen } from '../src/components/Screen';
import { mockCategories, mockTransactions } from '../src/mocks/financial-data';
import { colors } from '../src/theme/theme';
import { formatCurrency, formatDate } from '../src/utils/formatters';

export default function TransactionsScreen() {
  return (
    <Screen title="Transacoes" subtitle="Lista mockada pronta para trocar por GET /api/transactions.">
      <AppButton label="Cadastrar transacao" onPress={() => router.push('/transaction-new')} />
      {mockTransactions.map((transaction) => {
        const category = mockCategories.find((item) => item.id === transaction.categoryId);

        return (
          <ListItem
            key={transaction.id}
            accentColor={transaction.type === 'income' ? colors.success : colors.danger}
            amount={formatCurrency(transaction.amount)}
            description={`${category?.name ?? 'Sem categoria'} - ${formatDate(transaction.date)}`}
            title={transaction.description}
          />
        );
      })}
    </Screen>
  );
}
