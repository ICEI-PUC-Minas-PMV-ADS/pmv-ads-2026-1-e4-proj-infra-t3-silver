import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../src/context/ThemeContext';
import { deleteTransaction, getTransaction, resolveAttachmentUrl } from '../src/services/api';
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError('');
    getTransaction(id)
      .then(setTransaction)
      .catch(() => setError('Não foi possível carregar a transação.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  function confirmDelete() {
    if (!transaction) return;
    Alert.alert('Excluir transação', `Deseja excluir "${transaction.description}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          if (!id) return;
          setIsDeleting(true);
          try {
            await deleteTransaction(id);
            router.back();
          } catch {
            setError('Não foi possível excluir a transação.');
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  }

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (error && !transaction) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.muted }]}>Transação não encontrada.</Text>
      </View>
    );
  }

  const isIncome = transaction.type === 'income';

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: colors.background }}>
      <View
        style={[
          styles.amountBadge,
          { backgroundColor: isIncome ? colors.successLight : colors.dangerLight },
        ]}
      >
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: isIncome ? colors.success : colors.danger },
          ]}
        >
          <Text style={styles.iconText}>{isIncome ? '↑' : '↓'}</Text>
        </View>
        <Text style={[styles.amountValue, { color: isIncome ? colors.success : colors.danger }]}>
          {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
        </Text>
        <Text style={[styles.amountType, { color: colors.muted }]}>
          {TYPE_LABEL[transaction.type]}
        </Text>
      </View>

      <View
        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <DetailRow label="Descrição" value={transaction.description} colors={colors} />
        <Divider colors={colors} />
        <DetailRow label="Data" value={formatDate(transaction.date)} colors={colors} />
        <Divider colors={colors} />
        <DetailRow label="Tipo" value={TYPE_LABEL[transaction.type]} colors={colors} />
        <Divider colors={colors} />
        <DetailRow label="Valor" value={formatCurrency(transaction.amount)} colors={colors} />
      </View>

      {transaction.attachmentUrl ? (
        <View
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📎 Comprovante</Text>
          <Image
            resizeMode="contain"
            source={{ uri: resolveAttachmentUrl(transaction.attachmentUrl) }}
            style={styles.image}
          />
        </View>
      ) : null}

      {error ? (
        <Text style={[styles.feedbackError, { color: colors.danger }]}>{error}</Text>
      ) : null}

      <Pressable
        onPress={confirmDelete}
        disabled={isDeleting}
        style={[
          styles.deleteButton,
          { backgroundColor: colors.dangerLight, borderColor: colors.danger },
        ]}
      >
        {isDeleting ? (
          <ActivityIndicator color={colors.danger} size="small" />
        ) : (
          <Text style={[styles.deleteText, { color: colors.danger }]}>🗑️ Excluir transação</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

function DetailRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

function Divider({ colors }: { colors: ReturnType<typeof useTheme>['colors'] }) {
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    padding: spacing.md,
    paddingBottom: spacing.xxl,
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
    gap: spacing.sm,
    padding: spacing.lg,
  },
  iconCircle: {
    alignItems: 'center',
    borderRadius: radius.full,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  iconText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
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
  detailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: typography.small,
  },
  detailValue: {
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
    marginTop: spacing.sm,
    width: '100%',
  },
  deleteButton: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: spacing.sm,
    minHeight: 48,
  },
  deleteText: {
    fontSize: typography.body,
    fontWeight: '700',
  },
  errorText: {
    fontSize: typography.body,
    textAlign: 'center',
  },
  feedbackError: {
    fontSize: typography.small,
    textAlign: 'center',
  },
});
