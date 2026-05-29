import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Share, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { Screen } from '../src/components/Screen';
import { useTheme } from '../src/context/ThemeContext';
import { getFamily, getFamilyMembers, joinFamily } from '../src/services/api';
import { radius, spacing, typography } from '../src/theme/theme';
import { Family, FamilyMember } from '../src/types/financial';
import { getApiErrorMessage } from '../src/utils/api-error';

export default function FamilyScreen() {
  const { colors } = useTheme();
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [joinId, setJoinId] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      setError('');
      Promise.all([getFamily(), getFamilyMembers()])
        .then(([fam, mems]) => {
          setFamily(fam);
          setMembers(mems);
        })
        .catch(() => setError('Não foi possível carregar os dados da família.'))
        .finally(() => setIsLoading(false));
    }, [])
  );

  const familyId = String(family?._id ?? family?.id ?? '');

  function handleShareId() {
    if (!family) return;
    Share.share({
      message: `Entre na minha família no Silver!\nID da família: ${familyId}`,
    });
  }

  function confirmJoin() {
    if (!joinId.trim()) { setJoinError('Informe o ID da família.'); return; }
    Alert.alert(
      'Entrar em outra família',
      'Suas contas, transações, categorias e metas serão migradas para a família informada. Esta ação não pode ser desfeita.\n\nDeseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', style: 'destructive', onPress: handleJoin },
      ]
    );
  }

  async function handleJoin() {
    setJoinError('');
    setIsJoining(true);
    try {
      await joinFamily(joinId.trim());
      setJoinId('');
      Alert.alert('Sucesso', 'Você entrou na nova família! Os dados foram migrados.', [
        { text: 'OK', onPress: () => router.replace('/dashboard') },
      ]);
    } catch (err) {
      setJoinError(getApiErrorMessage(err));
    } finally {
      setIsJoining(false);
    }
  }

  return (
    <Screen title="Família">
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Minha família</Text>

        {isLoading ? (
          <Text style={[styles.muted, { color: colors.muted }]}>Carregando...</Text>
        ) : error ? (
          <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
        ) : family ? (
          <>
            <Text style={[styles.familyName, { color: colors.text }]}>{family.name}</Text>

            <View style={[styles.idBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.idLabel, { color: colors.muted }]}>ID da família</Text>
              <Text style={[styles.idValue, { color: colors.text }]} numberOfLines={1} ellipsizeMode="middle">
                {familyId}
              </Text>
            </View>

            <AppButton label="Compartilhar ID para convidar" onPress={handleShareId} variant="secondary" />
          </>
        ) : null}
      </View>

      {members.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Membros ({members.length})</Text>
          {members.map((member) => (
            <View key={String(member._id ?? member.id)} style={[styles.memberRow, { borderColor: colors.border }]}>
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarText}>{member.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
                <Text style={[styles.memberEmail, { color: colors.muted }]}>{member.email}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Entrar em outra família</Text>
        <Text style={[styles.muted, { color: colors.muted }]}>
          Cole o ID compartilhado por outro membro. Seus dados serão migrados para a família informada.
        </Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setJoinId}
          placeholder="Cole o ID da família aqui"
          placeholderTextColor={colors.mutedLight}
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
          value={joinId}
        />
        {joinError ? <Text style={[styles.errorText, { color: colors.danger }]}>{joinError}</Text> : null}
        <AppButton
          disabled={isJoining}
          label={isJoining ? 'Entrando...' : 'Entrar na família'}
          onPress={confirmJoin}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.small,
    fontWeight: '700',
  },
  familyName: {
    fontSize: typography.subtitle,
    fontWeight: '700',
  },
  idBox: {
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  idLabel: {
    fontSize: typography.xs,
    fontWeight: '600',
  },
  idValue: {
    fontFamily: 'monospace',
    fontSize: typography.small,
  },
  memberRow: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  avatar: {
    alignItems: 'center',
    borderRadius: radius.full,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: typography.body,
    fontWeight: '700',
  },
  memberInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  memberName: {
    fontSize: typography.small,
    fontWeight: '600',
  },
  memberEmail: {
    fontSize: typography.xs,
  },
  input: {
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: typography.body,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  muted: {
    fontSize: typography.small,
    lineHeight: 20,
  },
  errorText: {
    fontSize: typography.small,
  },
});
