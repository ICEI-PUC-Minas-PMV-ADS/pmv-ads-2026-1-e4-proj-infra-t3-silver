import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { Screen } from '../src/components/Screen';
import { useTheme } from '../src/context/ThemeContext';
import {
  createBudget,
  deleteBudget,
  getBudgets,
  getCategories,
  updateBudget,
} from '../src/services/api';
import { radius, spacing, typography } from '../src/theme/theme';
import { Budget, Category } from '../src/types/financial';
import { getApiErrorMessage } from '../src/utils/api-error';
import { formatCurrency } from '../src/utils/formatters';

type BudgetForm = {
  id?: string;
  categoryId: string;
  monthYear: string;
  limitAmount: string;
};

const currentMonth = new Date().toISOString().slice(0, 7);

const emptyForm: BudgetForm = {
  id: undefined,
  categoryId: '',
  monthYear: currentMonth,
  limitAmount: '',
};

function getBudgetId(budget: Budget): string | undefined {
  if (budget._id) return budget._id;
  if (budget.id !== undefined && budget.id !== null) return String(budget.id);
  return undefined;
}

function getCategoryId(cat: Category): string {
  return String(cat._id ?? cat.id);
}

function parseMoney(value: string): number {
  if (!value) return 0;
  return Number(value.replace(/\./g, '').replace(',', '.') || 0);
}

export default function BudgetsScreen() {
  const { colors } = useTheme();

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<BudgetForm>(emptyForm);

  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  function updateForm(field: keyof BudgetForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function openCreateModal() {
    setForm(emptyForm);
    setModalVisible(true);
  }

  function openEditModal(budget: Budget) {
    setForm({
      id: getBudgetId(budget),
      categoryId: budget.categoryId,
      monthYear: budget.monthYear,
      limitAmount: String(budget.limitAmount),
    });
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setForm(emptyForm);
  }

  async function loadData() {
    try {
      setLoading(true);
      const [budgetsData, categoriesData] = await Promise.all([
        getBudgets(),
        getCategories(),
      ]);
      setBudgets(budgetsData);
      setCategories(categoriesData);
    } catch (error) {
      Alert.alert('Erro ao carregar orçamentos', getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!form.categoryId) {
      Alert.alert('Atenção', 'Selecione uma categoria.');
      return;
    }
    if (!form.monthYear.match(/^\d{4}-(0[1-9]|1[0-2])$/)) {
      Alert.alert('Atenção', 'Informe o mês no formato AAAA-MM (ex: 2026-05).');
      return;
    }
    const limit = parseMoney(form.limitAmount);
    if (!form.limitAmount || limit <= 0) {
      Alert.alert('Atenção', 'Informe um valor limite maior que zero.');
      return;
    }

    try {
      setSaving(true);
      if (isEditing && form.id) {
        await updateBudget(form.id, { limitAmount: limit });
      } else {
        await createBudget({
          categoryId: form.categoryId,
          monthYear: form.monthYear,
          limitAmount: limit,
        });
      }
      closeModal();
      await loadData();
      Alert.alert('Sucesso', isEditing ? 'Orçamento atualizado.' : 'Orçamento criado.');
    } catch (error) {
      Alert.alert('Erro ao salvar orçamento', getApiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(budget: Budget) {
    const id = getBudgetId(budget);
    if (!id) {
      Alert.alert('Erro', 'ID do orçamento não encontrado.');
      return;
    }
    const category = categories.find((c) => getCategoryId(c) === budget.categoryId);
    const name = category?.name ?? 'este orçamento';
    const message = `Deseja realmente excluir o orçamento de "${name}"?`;

    const doDelete = async () => {
      try {
        await deleteBudget(id);
        await loadData();
        Alert.alert('Sucesso', 'Orçamento excluído.');
      } catch (error) {
        Alert.alert('Erro ao excluir', getApiErrorMessage(error));
      }
    };

    if (Platform.OS === 'web') {
      // eslint-disable-next-line no-alert
      if ((window as any).confirm(message)) {
        await doDelete();
      }
    } else {
      Alert.alert('Excluir orçamento', message, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: doDelete },
      ]);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  if (loading) {
    return (
      <Screen title="Orçamentos" subtitle="Carregando seus orçamentos mensais.">
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={{ color: colors.muted }}>Carregando orçamentos...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen title="Orçamentos" subtitle="Gerencie seus limites de gastos mensais por categoria.">
      <AppButton label="Novo orçamento" onPress={openCreateModal} />

      <FlatList
        data={budgets}
        keyExtractor={(item, index) => getBudgetId(item) ?? String(index)}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={[styles.emptyBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Nenhum orçamento cadastrado ainda.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const category = categories.find((c) => getCategoryId(c) === item.categoryId);
          const pct = item.limitAmount > 0
            ? Math.min(100, Math.round((item.spentAmount / item.limitAmount) * 100))
            : 0;
          const remaining = Math.max(0, item.limitAmount - item.spentAmount);
          const isOver = item.spentAmount > item.limitAmount;
          const barColor =
            pct >= 100 ? colors.danger :
            pct >= 85  ? '#f97316' :
            pct >= 60  ? '#eab308' :
            colors.success;

          return (
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.dot, { backgroundColor: category?.color ?? colors.muted }]} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {category?.name ?? 'Categoria'}
                </Text>
                <Text style={[styles.badge, { color: colors.primary, backgroundColor: colors.background }]}>
                  {item.monthYear}
                </Text>
              </View>

              <View style={styles.amountRow}>
                <Text style={[styles.amountSpent, { color: colors.muted }]}>
                  {formatCurrency(item.spentAmount)}{' '}
                  <Text style={[styles.amountLimit, { color: colors.muted }]}>
                    de {formatCurrency(item.limitAmount)}
                  </Text>
                </Text>
                <Text style={[styles.pctText, { color: barColor }]}>{pct}%</Text>
              </View>

              <View style={[styles.track, { backgroundColor: colors.background }]}>
                <View style={[styles.fill, { width: `${pct}%`, backgroundColor: barColor }]} />
              </View>

              <Text style={[styles.remaining, { color: barColor }]}>
                {isOver ? 'Limite excedido' : `${formatCurrency(remaining)} disponível`}
              </Text>

              <View style={styles.actions}>
                <AppButton label="Editar" onPress={() => openEditModal(item)} variant="secondary" />
                <AppButton label="Excluir" onPress={() => handleDelete(item)} variant="danger" />
              </View>
            </View>
          );
        }}
      />

      <Modal visible={modalVisible} animationType="slide">
        <Screen
          title={isEditing ? 'Editar orçamento' : 'Novo orçamento'}
          subtitle={
            isEditing
              ? 'Altere o valor limite do orçamento.'
              : 'Defina um limite de gastos para uma categoria no mês.'
          }
        >
          <View style={[styles.form, { backgroundColor: colors.surface, borderColor: colors.border }]}>

            {!isEditing && (
              <>
                <Text style={[styles.label, { color: colors.text }]}>Categoria</Text>

                {categories.length === 0 ? (
                  <Text style={[styles.emptyText, { color: colors.muted }]}>
                    Nenhuma categoria disponível.
                  </Text>
                ) : (
                  categories.map((cat) => {
                    const catId = getCategoryId(cat);
                    const selected = form.categoryId === catId;
                    return (
                      <Pressable
                        key={catId}
                        onPress={() => updateForm('categoryId', catId)}
                        style={[
                          styles.catItem,
                          {
                            backgroundColor: selected ? colors.primary : colors.background,
                            borderColor: selected ? colors.primary : colors.border,
                          },
                        ]}
                      >
                        <View style={[styles.dot, { backgroundColor: cat.color }]} />
                        <Text style={[styles.catItemText, { color: selected ? '#fff' : colors.text }]}>
                          {cat.name}
                        </Text>
                      </Pressable>
                    );
                  })
                )}

                <Text style={[styles.label, { color: colors.text, marginTop: spacing.sm }]}>
                  Mês de referência
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder="AAAA-MM"
                  placeholderTextColor={colors.mutedLight}
                  value={form.monthYear}
                  onChangeText={(v) => updateForm('monthYear', v)}
                  keyboardType="numeric"
                  maxLength={7}
                />
              </>
            )}

            <Text style={[styles.label, { color: colors.text }]}>
              {isEditing ? 'Novo valor limite (R$)' : 'Valor limite (R$)'}
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              placeholder="0,00"
              placeholderTextColor={colors.mutedLight}
              value={form.limitAmount}
              onChangeText={(v) => updateForm('limitAmount', v)}
              keyboardType="decimal-pad"
            />

            <AppButton
              disabled={saving}
              label={saving ? 'Salvando...' : isEditing ? 'Atualizar orçamento' : 'Criar orçamento'}
              onPress={handleSave}
            />
            <AppButton label="Cancelar" onPress={closeModal} variant="secondary" />
          </View>
        </Screen>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 220,
  },
  emptyBox: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  emptyText: {
    fontSize: typography.small,
    textAlign: 'center',
  },
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    borderRadius: radius.full,
    height: 12,
    width: 12,
  },
  cardTitle: {
    flex: 1,
    fontSize: typography.subtitle,
    fontWeight: '700',
  },
  badge: {
    borderRadius: radius.full,
    fontSize: typography.xs,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  amountRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountSpent: {
    fontSize: typography.small,
  },
  amountLimit: {
    fontSize: typography.xs,
  },
  pctText: {
    fontSize: typography.small,
    fontWeight: '700',
  },
  track: {
    borderRadius: radius.full,
    height: 8,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    borderRadius: radius.full,
    height: 8,
  },
  remaining: {
    fontSize: typography.xs,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  form: {
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  label: {
    fontSize: typography.small,
    fontWeight: '700',
  },
  input: {
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: typography.body,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  catItem: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  catItemText: {
    fontSize: typography.body,
  },
});
