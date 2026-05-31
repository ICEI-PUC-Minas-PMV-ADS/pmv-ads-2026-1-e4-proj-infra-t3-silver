import { router } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../src/components/Screen';
import { useTheme } from '../src/context/ThemeContext';
import { useCategories } from '../src/hooks/useCategories';
import { radius, spacing, typography } from '../src/theme/theme';

const KIND_LABEL: Record<string, string> = {
  expense: 'Despesa',
  income: 'Receita',
  both: 'Ambos',
};

export default function CategoriesScreen() {
  const { colors } = useTheme();
  const { categories, removeCategory } = useCategories();

  function confirmDelete(id: string | number, name: string) {
    if (Platform.OS === 'web') {
      if (window.confirm(`Deseja excluir "${name}"?`)) {
        removeCategory(id);
      }
      return;
    }
    const { Alert } = require('react-native');
    Alert.alert('Excluir categoria', `Deseja excluir "${name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => removeCategory(id),
      },
    ]);
  }

  return (
    <Screen title="Categorias" subtitle="Compartilhadas entre despesas e receitas.">
      <Pressable
        onPress={() => router.push('/category-new')}
        style={[styles.addButton, { backgroundColor: colors.primary }]}
      >
        <Text style={[styles.addButtonText, { color: '#ffffff' }]}>+ Nova categoria</Text>
      </Pressable>

      {categories.length === 0 && (
        <Text style={[styles.empty, { color: colors.muted }]}>
          Nenhuma categoria cadastrada. Crie uma para começar.
        </Text>
      )}

      {categories.map((category) => {
        const id = String(category._id ?? category.id);
        return (
          <View
            key={id}
            style={[styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={[styles.accent, { backgroundColor: category.color }]} />
            <Text style={styles.iconText}>{category.icon ?? '📁'}</Text>
            <View style={styles.content}>
              <Text style={[styles.name, { color: colors.text }]}>{category.name}</Text>
              <Text style={[styles.kind, { color: colors.muted }]}>
                {KIND_LABEL[category.kind] ?? category.kind}
              </Text>
            </View>
            <Pressable
              onPress={() => router.push(`/category-edit?id=${id}`)}
              style={[styles.actionButton, { borderColor: colors.border }]}
            >
              <Text style={[styles.actionText, { color: colors.primary }]}>Editar</Text>
            </Pressable>
            <Pressable
              onPress={() => confirmDelete(id, category.name)}
              style={[styles.actionButton, { borderColor: colors.border }]}
            >
              <Text style={[styles.actionText, { color: colors.danger }]}>Excluir</Text>
            </Pressable>
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    borderRadius: radius.md,
    minHeight: 48,
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  addButtonText: {
    fontSize: typography.body,
    fontWeight: '700',
  },
  empty: {
    fontSize: typography.body,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  item: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  accent: {
    borderRadius: radius.sm,
    height: 36,
    width: 6,
  },
  iconText: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    fontSize: typography.body,
    fontWeight: '700',
  },
  kind: {
    fontSize: typography.small,
  },
  actionButton: {
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  actionText: {
    fontSize: typography.small,
    fontWeight: '600',
  },
});
