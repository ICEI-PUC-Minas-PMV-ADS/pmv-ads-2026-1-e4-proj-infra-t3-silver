import { ListItem } from '../src/components/ListItem';
import { Screen } from '../src/components/Screen';
import { mockCategories } from '../src/mocks/financial-data';

export default function CategoriesScreen() {
  return (
    <Screen title="Categorias" subtitle="Categorias compartilhadas para despesas e receitas. Integracao futura: GET /api/categorias.">
      {mockCategories.map((category) => (
        <ListItem key={category.id} accentColor={category.color} description={category.kind} title={category.name} />
      ))}
    </Screen>
  );
}
