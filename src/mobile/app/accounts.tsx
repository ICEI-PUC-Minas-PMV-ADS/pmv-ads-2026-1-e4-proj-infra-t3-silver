import { ListItem } from '../src/components/ListItem';
import { Screen } from '../src/components/Screen';
import { mockAccounts } from '../src/mocks/financial-data';
import { formatCurrency } from '../src/utils/formatters';

export default function AccountsScreen() {
  return (
    <Screen title="Contas" subtitle="Saldos mockados. Integracao futura: GET /api/accounts.">
      {mockAccounts.map((account) => (
        <ListItem key={account.id} amount={formatCurrency(account.balance)} description={account.type} title={account.name} />
      ))}
    </Screen>
  );
}
