import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { Screen } from '../src/components/Screen';
import { useTheme } from '../src/context/ThemeContext';
import { useCategories } from '../src/hooks/useCategories';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../src/mocks/financial-data';
import { radius, spacing, typography } from '../src/theme/theme';
import { CategoryKind } from '../src/types/financial';

const KIND_OPTIONS: { value: CategoryKind; label: string }[] = [
  { value: 'expense', label: 'Despesa' },
  { value: 'income', label: 'Receita' },
  { value: 'both', label: 'Ambos' },
];

export default function CategoryEditScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { categories, updateCategory } = useCategories();
  const [name, setName] = useState('');
  const [kind, setKind] = useState<CategoryKind>('expense');
  const [color, setColor] = useState(CATEGORY_COLORS[0]);
  const [icon, setIcon] = useState(CATEGORY_ICONS[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    const category = categories.find((c) => String(c.id) === id);
    if (!category) {
      setError('Categoria não encontrada.');
      return;
    }
    setName(category.name);
    setKind(category.kind);
    setColor(category.color);
    setIcon(category.icon ?? CATEGORY_ICONS[0]);
  }, [id, categories]);

  function handleSave() {
    if (!name.trim()) {
      setError('Informe o nome da categoria.');
      return;
    }
    const updated = updateCategory(id, { name: name.trim(), kind, color, icon });
    if (!updated) {
      setError('Erro ao salvar a categoria.');
      return;
    }
    router.back();
  }

  return (
    <Screen title="Editar categoria">
      <View style={[styles.form, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text }]}>Nome</Text>
        <TextInput
          onChangeText={setName}
          placeholder="Ex.: Alimentação"
          placeholderTextColor={colors.mutedLight}
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
          value={name}
        />

        <Text style={[styles.label, { color: colors.text }]}>Tipo</Text>
        <View style={styles.kindRow}>
          {KIND_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => setKind(opt.value)}
              style={[
                styles.kindButton,
                { borderColor: colors.border },
                kind === opt.value && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
            >
              <Text style={[styles.kindText, { color: kind === opt.value ? '#ffffff' : colors.muted }]}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Cor</Text>
        <View style={styles.swatchRow}>
          {CATEGORY_COLORS.map((c) => (
            <Pressable
              key={c}
              onPress={() => setColor(c)}
              style={[
                styles.swatch,
                { backgroundColor: c },
                color === c && styles.swatchSelected,
              ]}
            />
          ))}
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Ícone</Text>
        <View style={styles.iconRow}>
          {CATEGORY_ICONS.map((ic) => (
            <Pressable
              key={ic}
              onPress={() => setIcon(ic)}
              style={[
                styles.iconButton,
                { borderColor: colors.border },
                icon === ic && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
            >
              <Text style={styles.iconText}>{ic}</Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.preview, { backgroundColor: color + '20', borderColor: color }]}>
          <Text style={styles.previewIcon}>{icon}</Text>
          <View>
            <Text style={[styles.previewName, { color: colors.text }]}>{name || 'Nome da categoria'}</Text>
            <Text style={[styles.previewKind, { color: colors.muted }]}>
              {KIND_OPTIONS.find((o) => o.value === kind)?.label}
            </Text>
          </View>
        </View>

        {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

        <AppButton label="Salvar" onPress={handleSave} />
        <AppButton label="Cancelar" onPress={() => router.back()} variant="secondary" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  kindRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  kindButton: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    paddingVertical: spacing.sm,
  },
  kindText: {
    fontSize: typography.small,
    fontWeight: '600',
  },
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  swatch: {
    borderRadius: radius.full,
    height: 32,
    width: 32,
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: '#ffffff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  iconText: {
    fontSize: 20,
  },
  preview: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  previewIcon: {
    fontSize: 28,
  },
  previewName: {
    fontSize: typography.body,
    fontWeight: '700',
  },
  previewKind: {
    fontSize: typography.small,
  },
  error: {
    fontSize: typography.small,
  },
});
