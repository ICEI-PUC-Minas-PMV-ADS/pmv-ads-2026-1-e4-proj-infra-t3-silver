import { ListItem } from '../src/components/ListItem';
import { Screen } from '../src/components/Screen';
import { useTheme } from '../src/context/ThemeContext';
import { mockGoals } from '../src/mocks/financial-data';
import { formatCurrency, formatDate, formatPercent } from '../src/utils/formatters';

export default function GoalsScreen() {
  const { colors } = useTheme();

  return (
    <Screen title="Metas" subtitle="Acompanhamento mockado das metas familiares. Integracao futura: GET /api/goals.">
      {mockGoals.map((goal) => {
        const progress = goal.currentAmount / goal.targetAmount;

        return (
          <ListItem
            key={goal.id}
            accentColor={colors.success}
            amount={formatPercent(progress)}
            description={`${formatCurrency(goal.currentAmount)} de ${formatCurrency(goal.targetAmount)} ate ${formatDate(goal.deadline)}`}
            title={goal.name}
          />
        );
      })}
    </Screen>
  );
}
