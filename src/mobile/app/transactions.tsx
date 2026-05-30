import { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useTheme } from '../src/context/ThemeContext';
import { mockCategories, mockTransactions } from '../src/mocks/financial-data';
import { radius, spacing, typography } from '../src/theme/theme';
import { Category, Transaction, TransactionType } from '../src/types/financial';
import { formatCurrency, formatDate } from '../src/utils/formatters';

type FilterType = 'all' | 'income' | 'expense';

const FILTER_OPTIONS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'income', label: 'Receitas' },
  { key: 'expense', label: 'Despesas' },
];

const ALL_CATEGORIES: Category[] = mockCategories;

let stored: Transaction[] = [...mockTransactions];
let nextId = stored.length + 1;
let onChange: (() => void) | null = null;

function save(txs: Transaction[]) {
  stored = txs;
  onChange?.();
}

function getStored(): Transaction[] {
  return stored;
}

export default function TransactionsScreen() {
  const { colors } = useTheme();
  const [, setTick] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>(getStored);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formDesc, setFormDesc] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formType, setFormType] = useState<TransactionType>('expense');
  const [refreshing, setRefreshing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  onChange = () => {
    setTransactions([...getStored()]);
    setTick((t) => t + 1);
  };

  function showFeedback(msg: string) {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setFeedback(msg);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 2000);
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showFeedback('Sincronizado com o servidor');
    }, 1200);
  }, []);

  const balance = useMemo(() => {
    const list = applyFilters(transactions, filterType, search);
    const income = list.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0);
    const expense = list.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions, filterType, search]);

  const grouped = useMemo(() => {
    const list = applyFilters(transactions, filterType, search);
    const map = new Map<string, Transaction[]>();
    for (const t of list) {
      const key = t.date ?? 'unknown';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return map;
  }, [transactions, filterType, search]);

  function handleDelete(tx: Transaction) {
    save(getStored().filter((t) => String(t.id) !== String(tx.id)));
    showFeedback(`"${tx.description}" removida`);
  }

  function handleCreate() {
    if (!formDesc.trim()) return;
    const v = parseFloat(formAmount.replace(',', '.'));
    if (isNaN(v) || v <= 0) return;
    const cat = formType === 'income'
      ? ALL_CATEGORIES.find((c) => c.kind === 'income' || c.kind === 'both')!
      : ALL_CATEGORIES.find((c) => c.kind === 'expense' || c.kind === 'both')!;
    const tx: Transaction = {
      id: String(nextId++),
      description: formDesc.trim(),
      amount: v,
      type: formType,
      date: new Date().toISOString().split('T')[0],
      accountId: '1',
      categoryId: String(cat.id),
    };
    save([tx, ...getStored()]);
    setFormDesc('');
    setFormAmount('');
    setFormType('expense');
    setShowForm(false);
    showFeedback('Transação adicionada com sucesso');
  }

  function getCat(id: string | number | undefined) {
    if (id == null) return { name: 'Outras', color: '#6B7280' };
    const found = ALL_CATEGORIES.find((c) => String(c.id) === String(id));
    return found ?? { name: 'Outras', color: '#6B7280' };
  }

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} tintColor={colors.primary} colors={[colors.primary]} />}
      >
        <Text style={[styles.title, { color: colors.text }]}>Transações</Text>

        {feedback && (
          <View style={[styles.feedback, { backgroundColor: colors.primary }]}>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        )}

        <View style={[styles.summaryBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.chip, { backgroundColor: colors.successLight }]}>
            <Text style={[styles.chipLabel, { color: colors.success }]}>Receitas</Text>
            <Text style={[styles.chipValue, { color: colors.success }]}>{formatCurrency(balance.income)}</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: colors.dangerLight }]}>
            <Text style={[styles.chipLabel, { color: colors.danger }]}>Despesas</Text>
            <Text style={[styles.chipValue, { color: colors.danger }]}>{formatCurrency(balance.expense)}</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: colors.background }]}>
            <Text style={[styles.chipLabel, { color: colors.text }]}>Saldo</Text>
            <Text style={[styles.chipValue, { color: colors.text }]}>{formatCurrency(balance.balance)}</Text>
          </View>
        </View>

        <TextInput
          onChangeText={setSearch}
          placeholder="Pesquisar transações..."
          placeholderTextColor={colors.mutedLight}
          style={[styles.searchInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          value={search}
        />

        <View style={styles.filterRow}>
          {FILTER_OPTIONS.map((opt) => {
            const active = filterType === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => setFilterType(opt.key)}
                style={[styles.filterChip, { borderColor: colors.border }, active && { backgroundColor: colors.primary, borderColor: colors.primary }]}
              >
                <Text style={[styles.filterChipText, { color: active ? '#fff' : colors.muted }]}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {showForm && (
          <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
            <Text style={[styles.formLabel, { color: colors.text }]}>Nova transação</Text>
            <TextInput
              onChangeText={setFormDesc}
              placeholder="Descrição"
              placeholderTextColor={colors.mutedLight}
              style={[styles.formInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
              value={formDesc}
            />
            <TextInput
              keyboardType="decimal-pad"
              onChangeText={setFormAmount}
              placeholder="Valor"
              placeholderTextColor={colors.mutedLight}
              style={[styles.formInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
              value={formAmount}
            />
            <View style={styles.typeRow}>
              {(['expense', 'income'] as TransactionType[]).map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setFormType(t)}
                  style={[styles.typeBtn, { borderColor: colors.border }, formType === t && { backgroundColor: colors.primary }]}
                >
                  <Text style={[styles.typeBtnText, { color: formType === t ? '#fff' : colors.muted }]}>
                    {t === 'expense' ? 'Despesa' : 'Receita'}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable onPress={handleCreate} style={[styles.createBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.createBtnText}>Adicionar</Text>
            </Pressable>
          </View>
        )}

        {Array.from(grouped.entries()).length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>Nenhuma transação encontrada</Text>
            <Text style={[styles.emptySub, { color: colors.muted }]}>Aperte + para adicionar</Text>
          </View>
        ) : (
          Array.from(grouped.entries()).map(([date, txs]) => (
            <View key={date}>
              <Text style={[styles.dateHeader, { color: colors.muted }]}>
                {date === 'unknown' ? 'Sem data' : formatDate(date)} ({txs.length})
              </Text>
              {txs.map((tx) => {
                const cat = getCat(tx.categoryId);
                const isIncome = tx.type === 'income';
                return (
                  <View key={tx.id} style={[styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                    <View style={styles.itemBody}>
                      <Text style={[styles.itemDesc, { color: colors.text }]} numberOfLines={1}>{tx.description}</Text>
                      <Text style={[styles.itemCat, { color: colors.muted }]}>{cat.name}</Text>
                    </View>
                    <Text style={[styles.itemAmount, { color: isIncome ? colors.success : colors.danger }]}>
                      {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                    </Text>
                    <Pressable
                      onPress={() => handleDelete(tx)}
                      style={[styles.delBtn, { backgroundColor: colors.dangerLight }]}
                    >
                      <Text style={{ color: colors.danger, fontSize: 16 }}>✕</Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>

      <Pressable
        onPress={() => setShowForm((p) => !p)}
        style={[styles.fab, { backgroundColor: showForm ? colors.danger : colors.primary }]}
      >
        <Text style={styles.fabText}>{showForm ? '✕' : '+'}</Text>
      </Pressable>
    </View>
  );
}

function applyFilters(list: Transaction[], type: FilterType, search: string): Transaction[] {
  let result = list;
  if (type !== 'all') result = result.filter((t) => t.type === type);
  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        formatCurrency(t.amount).includes(q)
    );
  }
  return result;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { gap: spacing.sm, padding: spacing.md, paddingBottom: 100 },
  title: { fontSize: typography.title, fontWeight: '700', marginBottom: spacing.xs },
  feedback: {
    borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  feedbackText: { color: '#fff', fontSize: typography.small, fontWeight: '600', textAlign: 'center' },
  summaryBar: {
    borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: spacing.xs, padding: spacing.sm,
  },
  chip: { borderRadius: radius.sm, flex: 1, gap: 2, padding: spacing.sm },
  chipLabel: { fontSize: 11, fontWeight: '600', opacity: 0.8 },
  chipValue: { fontSize: typography.small, fontWeight: '700' },
  searchInput: {
    borderRadius: radius.md, borderWidth: 1, fontSize: typography.small, minHeight: 42, paddingHorizontal: spacing.md,
  },
  filterRow: { flexDirection: 'row', gap: spacing.xs },
  filterChip: {
    borderRadius: radius.full, borderWidth: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2,
  },
  filterChipText: { fontSize: typography.small, fontWeight: '600' },
  formCard: {
    borderRadius: radius.md, borderWidth: 2, gap: spacing.sm, padding: spacing.md,
  },
  formLabel: { fontSize: typography.small, fontWeight: '700' },
  formInput: {
    borderRadius: radius.md, borderWidth: 1, fontSize: typography.body, minHeight: 44, paddingHorizontal: spacing.md,
  },
  typeRow: { flexDirection: 'row', gap: spacing.xs },
  typeBtn: {
    borderRadius: radius.md, borderWidth: 1, flex: 1, alignItems: 'center', paddingVertical: spacing.sm,
  },
  typeBtnText: { fontSize: typography.small, fontWeight: '600' },
  createBtn: {
    alignItems: 'center', borderRadius: radius.md, minHeight: 44, justifyContent: 'center',
  },
  createBtnText: { color: '#fff', fontSize: typography.body, fontWeight: '700' },
  emptyState: { alignItems: 'center', marginTop: spacing.xl * 2 },
  emptyIcon: { fontSize: 48, marginBottom: spacing.sm },
  emptyText: { fontSize: typography.body, fontWeight: '600' },
  emptySub: { fontSize: typography.small, marginTop: spacing.xs },
  dateHeader: {
    fontSize: typography.small, fontWeight: '600', marginTop: spacing.sm, marginBottom: spacing.xs,
  },
  item: {
    alignItems: 'center', borderRadius: radius.md, borderWidth: 1, flexDirection: 'row',
    gap: spacing.sm, marginBottom: spacing.xs, padding: spacing.md,
  },
  catDot: { borderRadius: radius.full, height: 10, width: 10 },
  itemBody: { flex: 1, gap: 2 },
  itemDesc: { fontSize: typography.body, fontWeight: '600' },
  itemCat: { fontSize: 11 },
  itemAmount: { fontSize: typography.small, fontWeight: '700' },
  delBtn: {
    alignItems: 'center', borderRadius: radius.md, height: 32, justifyContent: 'center', width: 32,
  },
  fab: {
    alignItems: 'center', borderRadius: radius.full, bottom: 24, height: 56, justifyContent: 'center',
    position: 'absolute', right: 24, width: 56,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8 },
      android: { elevation: 8 },
    }),
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '400', lineHeight: 30 },
});
