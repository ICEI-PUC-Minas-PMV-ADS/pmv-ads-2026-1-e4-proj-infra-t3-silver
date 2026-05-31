import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../src/context/ThemeContext';
import { getTransaction, resolveAttachmentUrl } from '../src/services/api';
import { radius, spacing, typography } from '../src/theme/theme';
import { Transaction } from '../src/types/financial';
import { formatCurrency, formatDate } from '../src/utils/formatters';

const TYPE_LABEL: Record<string, string> = {
  income: 'Receita',
  expense: 'Despesa',
};

export default function TransactionDetailScreen() {
  const { colors } = useTheme();
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
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (error || !transaction) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.error, { color: colors.danger }]}>{error || 'Transação não encontrada.'}</Text>
      </View>
    );
  }

  const isIncome = transaction.type === 'income';

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: colors.background }}>
      <View style={[styles.amountBadge, { backgroundColor: isIncome ? colors.successLight : colors.dangerLight }]}>
        <Text style={[styles.amountValue, { color: colors.text }]}>
          {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
        </Text>
        <Text style={[styles.amountType, { color: colors.muted }]}>{TYPE_LABEL[transaction.type]}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Row label="Descrição" value={transaction.description} />
        <Divider />
        <Row label="Data" value={formatDate(transaction.date)} />
        <Divider />
        <Row label="Tipo" value={TYPE_LABEL[transaction.type] ?? transaction.type} />
        <Divider />
        <Row label="Valor" value={formatCurrency(transaction.amount)} />
      </View>

      {transaction.attachmentUrl ? (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Comprovante</Text>
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
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

function Divider() {
  const { colors } = useTheme();
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

const styles = StyleSheet.create({
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
  amountValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  amountType: {
    fontSize: typography.small,
    fontWeight: '600',
  },
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowLabel: {
    fontSize: typography.small,
  },
  rowValue: {
    flexShrink: 1,
    fontSize: typography.small,
    fontWeight: '600',
    marginLeft: spacing.md,
    textAlign: 'right',
  },
  divider: {
    height: 1,
  },
  sectionTitle: {
    fontSize: typography.small,
    fontWeight: '700',
  },
  image: {
    borderRadius: radius.md,
    height: 240,
    width: '100%',
  },
  error: {
    fontSize: typography.body,
    textAlign: 'center',
  },
});
