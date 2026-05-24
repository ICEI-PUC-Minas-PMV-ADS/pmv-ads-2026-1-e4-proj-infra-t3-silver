import { ListItem } from '../src/components/ListItem';
import { Screen } from '../src/components/Screen';
import { mockTransactions } from '../src/mocks/financial-data';
import { colors } from '../src/theme/theme';
import { formatCurrency, formatDate } from '../src/utils/formatters';

export default function HistoryScreen() {
  const orderedTransactions = [...mockTransactions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Screen title="Historico" subtitle="Historico mockado por data. Pode evoluir para filtros e sincronizacao incremental.">
      {orderedTransactions.map((transaction) => (
        <ListItem
          key={transaction.id}
          accentColor={transaction.type === 'income' ? colors.success : colors.danger}
          amount={formatCurrency(transaction.amount)}
          description={formatDate(transaction.date)}
          title={transaction.description}
        />
      ))}
    </Screen>
  );
}
