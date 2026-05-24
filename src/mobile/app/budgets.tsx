import { ListItem } from '../src/components/ListItem';
import { Screen } from '../src/components/Screen';
import { mockBudgets, mockCategories } from '../src/mocks/financial-data';
import { formatCurrency, formatPercent } from '../src/utils/formatters';

export default function BudgetsScreen() {
  return (
    <Screen title="Orcamentos" subtitle="Limites mensais mockados. Integracao futura: GET /api/budgets.">
      {mockBudgets.map((budget) => {
        const category = mockCategories.find((item) => item.id === budget.categoryId);
        const used = budget.spent / budget.limit;

        return (
          <ListItem
            key={budget.id}
            accentColor={category?.color}
            amount={formatPercent(used)}
            description={`${formatCurrency(budget.spent)} de ${formatCurrency(budget.limit)} em ${budget.month}`}
            title={category?.name ?? 'Categoria'}
          />
        );
      })}
    </Screen>
  );
}
