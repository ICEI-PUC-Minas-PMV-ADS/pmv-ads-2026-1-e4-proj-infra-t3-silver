import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { Screen } from '../src/components/Screen';
import { useTheme } from '../src/context/ThemeContext';
import { createGoal, deleteGoal, getGoals, updateGoal } from '../src/services/api';
import { radius, spacing, typography } from '../src/theme/theme';
import { Goal } from '../src/types/financial';
import { getApiErrorMessage } from '../src/utils/api-error';
import { formatCurrency } from '../src/utils/formatters';

type GoalForm = {
  id?: string;
  title: string;
  description: string;
  target_amount: string;
  current_amount: string;
  deadline: string;
  status: string;
};

const emptyForm: GoalForm = {
  id: undefined,
  title: '',
  description: '',
  target_amount: '',
  current_amount: '0',
  deadline: '',
  status: 'ativa',
};

function getGoalId(goal: Goal): string | undefined {
  if (goal._id) return goal._id;
  if (goal.id !== undefined && goal.id !== null) return String(goal.id);

  return undefined;
}

function parseMoney(value: string): number {
  if (!value) return 0;

  const normalized = value.replace(/\./g, '').replace(',', '.');

  return Number(normalized || 0);
}

export default function GoalsScreen() {
  const { colors } = useTheme();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<GoalForm>(emptyForm);

  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  function updateForm(field: keyof GoalForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openCreateModal() {
    setForm(emptyForm);
    setModalVisible(true);
  }

  function openEditModal(goal: Goal) {
    setForm({
      id: getGoalId(goal),
      title: goal.title ?? '',
      description: goal.description ?? '',
      target_amount: String(goal.target_amount ?? ''),
      current_amount: String(goal.current_amount ?? '0'),
      deadline: goal.deadline ? String(goal.deadline).slice(0, 10) : '',
      status: goal.status ?? 'ativa',
    });

    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setForm(emptyForm);
  }

  async function loadGoals() {
    try {
      setLoading(true);

      const data = await getGoals();

      setGoals(data);
    } catch (error) {
      Alert.alert('Erro ao carregar metas', getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      if (!form.title.trim()) {
        Alert.alert('Atenção', 'Informe o título da meta.');
        return;
      }

      if (!form.target_amount.trim()) {
        Alert.alert('Atenção', 'Informe o valor alvo.');
        return;
      }

      setSaving(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        target_amount: parseMoney(form.target_amount),
        current_amount: parseMoney(form.current_amount || '0'),
        deadline: form.deadline.trim() || null,
        status: form.status.trim() || 'ativa',
      };

      if (isEditing && form.id) {
        await updateGoal(form.id, payload);
      } else {
        await createGoal(payload);
      }

      closeModal();
      await loadGoals();

      Alert.alert(
        'Sucesso',
        isEditing ? 'Meta atualizada com sucesso.' : 'Meta cadastrada com sucesso.'
      );
    } catch (error) {
      Alert.alert('Erro ao salvar meta', getApiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(goal: Goal) {
    const id = getGoalId(goal);

    if (!id) {
      Alert.alert('Erro', 'ID da meta não encontrado.');
      return;
    }

    Alert.alert('Excluir meta', 'Deseja realmente excluir esta meta?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteGoal(id);
            await loadGoals();

            Alert.alert('Sucesso', 'Meta excluída com sucesso.');
          } catch (error) {
            Alert.alert('Erro ao excluir meta', getApiErrorMessage(error));
          }
        },
      },
    ]);
  }

  useFocusEffect(
    useCallback(() => {
      loadGoals();
    }, [])
  );

  if (loading) {
    return (
      <Screen title="Metas" subtitle="Carregando suas metas financeiras.">
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={{ color: colors.muted }}>Carregando metas...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen title="Metas" subtitle="Cadastre, acompanhe, edite e exclua suas metas financeiras.">
      <AppButton label="Nova meta" onPress={openCreateModal} />

      <FlatList
        data={goals}
        keyExtractor={(item, index) => getGoalId(item) ?? String(index)}
        scrollEnabled={false}
        ListEmptyComponent={
          <View
            style={[
              styles.emptyBox,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Nenhuma meta cadastrada ainda.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {item.title}
              </Text>

              <Text
                style={[
                  styles.badge,
                  {
                    color: colors.primary,
                    backgroundColor: colors.background,
                  },
                ]}
              >
                {item.status || 'ativa'}
              </Text>
            </View>

            {item.description ? (
              <Text style={[styles.description, { color: colors.muted }]}>
                {item.description}
              </Text>
            ) : null}

            <View style={styles.values}>
              <View
                style={[
                  styles.valueBox,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.valueLabel, { color: colors.muted }]}>
                  Atual
                </Text>
                <Text style={[styles.valueText, { color: colors.text }]}>
                  {formatCurrency(Number(item.current_amount || 0))}
                </Text>
              </View>

              <View
                style={[
                  styles.valueBox,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.valueLabel, { color: colors.muted }]}>
                  Alvo
                </Text>
                <Text style={[styles.valueText, { color: colors.text }]}>
                  {formatCurrency(Number(item.target_amount || 0))}
                </Text>
              </View>
            </View>

            <Text style={[styles.deadline, { color: colors.muted }]}>
              Prazo: {item.deadline ? String(item.deadline).slice(0, 10) : 'Não informado'}
            </Text>

            <View style={styles.actions}>
              <AppButton label="Editar" onPress={() => openEditModal(item)} variant="secondary" />
              <AppButton label="Excluir" onPress={() => handleDelete(item)} variant="danger" />
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <Screen
          title={isEditing ? 'Editar meta' : 'Nova meta'}
          subtitle={isEditing ? 'Atualize os dados da meta.' : 'Preencha os dados da nova meta.'}
        >
          <View
            style={[
              styles.form,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.label, { color: colors.text }]}>Título</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Ex.: Reserva de emergência"
              placeholderTextColor={colors.mutedLight}
              value={form.title}
              onChangeText={(value) => updateForm('title', value)}
            />

            <Text style={[styles.label, { color: colors.text }]}>Descrição</Text>
            <TextInput
              multiline
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Descrição da meta"
              placeholderTextColor={colors.mutedLight}
              value={form.description}
              onChangeText={(value) => updateForm('description', value)}
            />

            <Text style={[styles.label, { color: colors.text }]}>Valor alvo</Text>
            <TextInput
              keyboardType="numeric"
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="1000"
              placeholderTextColor={colors.mutedLight}
              value={form.target_amount}
              onChangeText={(value) => updateForm('target_amount', value)}
            />

            <Text style={[styles.label, { color: colors.text }]}>Valor atual</Text>
            <TextInput
              keyboardType="numeric"
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="0"
              placeholderTextColor={colors.mutedLight}
              value={form.current_amount}
              onChangeText={(value) => updateForm('current_amount', value)}
            />

            <Text style={[styles.label, { color: colors.text }]}>Prazo</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="AAAA-MM-DD"
              placeholderTextColor={colors.mutedLight}
              value={form.deadline}
              onChangeText={(value) => updateForm('deadline', value)}
            />

            <Text style={[styles.label, { color: colors.text }]}>Status</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="ativa, concluida ou cancelada"
              placeholderTextColor={colors.mutedLight}
              value={form.status}
              onChangeText={(value) => updateForm('status', value)}
            />

            <AppButton
              disabled={saving}
              label={saving ? 'Salvando...' : isEditing ? 'Atualizar meta' : 'Cadastrar meta'}
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
    justifyContent: 'space-between',
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
  description: {
    fontSize: typography.small,
    lineHeight: 20,
  },
  values: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  valueBox: {
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    padding: spacing.sm,
  },
  valueLabel: {
    fontSize: typography.xs,
    marginBottom: spacing.xs,
  },
  valueText: {
    fontSize: typography.small,
    fontWeight: '700',
  },
  deadline: {
    fontSize: typography.small,
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
  textArea: {
    minHeight: 88,
    paddingTop: spacing.sm,
    textAlignVertical: 'top',
  },
});