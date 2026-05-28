import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getTransaction, resolveAttachmentUrl } from '../src/services/api';
import { colors, radius, spacing, typography } from '../src/theme/theme';
import { Transaction } from '../src/types/financial';
import { formatCurrency, formatDate } from '../src/utils/formatters';

const TYPE_LABEL: Record<string, string> = {
  income: 'Receita',
  expense: 'Despesa',
};

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getTransaction(id)
      .then(setTransaction)
      .catch(() => setError('Não foi possível carregar a transação.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (error || !transaction) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error || 'Transação não encontrada.'}</Text>
      </View>
    );
  }

  const isIncome = transaction.type === 'income';

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.screen}>
      <View style={[styles.amountBadge, isIncome ? styles.badgeIncome : styles.badgeExpense]}>
        <Text style={styles.amountValue}>
          {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
        </Text>
        <Text style={styles.amountType}>{TYPE_LABEL[transaction.type]}</Text>
      </View>

      <View style={styles.card}>
        <Row label="Descrição" value={transaction.description} />
        <Divider />
        <Row label="Data" value={formatDate(transaction.date)} />
        <Divider />
        <Row label="Tipo" value={TYPE_LABEL[transaction.type] ?? transaction.type} />
        <Divider />
        <Row label="Valor" value={formatCurrency(transaction.amount)} />
      </View>

      {transaction.attachmentUrl ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Comprovante</Text>
          <Image
            resizeMode="contain"
            source={{ uri: resolveAttachmentUrl(transaction.attachmentUrl) }}
            style={styles.image}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  container: {
    gap: spacing.md,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  amountBadge: {
    alignItems: 'center',
    borderRadius: radius.md,
    gap: spacing.xs,
    padding: spacing.lg,
  },
  badgeIncome: {
    backgroundColor: '#D1FAE5',
  },
  badgeExpense: {
    backgroundColor: '#FEE2E2',
  },
  amountValue: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
  },
  amountType: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    color: colors.muted,
    fontSize: typography.small,
  },
  rowValue: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: spacing.md,
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
  },
  image: {
    borderRadius: radius.md,
    height: 240,
    width: '100%',
  },
  error: {
    color: colors.danger,
    fontSize: typography.body,
    textAlign: 'center',
  },
});
