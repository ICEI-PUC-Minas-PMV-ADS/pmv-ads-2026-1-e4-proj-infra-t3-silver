import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ListItem } from '../src/components/ListItem';
import { Screen } from '../src/components/Screen';
import { useTheme } from '../src/context/ThemeContext';
import { mockCategories } from '../src/mocks/financial-data';
import { radius, spacing, typography } from '../src/theme/theme';
import { Category } from '../src/types/financial';

let localCategories: Category[] = [...mockCategories];

const KIND_OPTIONS: { key: Category['kind']; label: string }[] = [
  { key: 'expense', label: 'Despesa' },
  { key: 'income', label: 'Receita' },
  { key: 'both', label: 'Ambos' },
];

export default function CategoriesScreen() {
  const { colors } = useTheme();
  const [categories, setCategories] = useState(localCategories);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6B7280');
  const [kind, setKind] = useState<Category['kind']>('expense');

  function handleAdd() {
    if (!name.trim()) return;
    const newCat: Category = {
      id: String(Date.now()),
      name: name.trim(),
      kind,
      color,
    };
    localCategories = [...localCategories, newCat];
    setCategories(localCategories);
    setName('');
    setColor('#6B7280');
    setKind('expense');
  }

  return (
    <Screen title="Categorias">
      <View style={[styles.form, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text }]}>Nova categoria</Text>
        <TextInput
          onChangeText={setName}
          placeholder="Nome"
          placeholderTextColor={colors.mutedLight}
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
          value={name}
        />
        <View style={styles.kindRow}>
          {KIND_OPTIONS.map((opt) => (
            <Pressable
              key={opt.key}
              onPress={() => setKind(opt.key)}
              style={[styles.kindBtn, { borderColor: colors.border }, kind === opt.key && { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.kindBtnTxt, { color: kind === opt.key ? '#fff' : colors.muted }]}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          onChangeText={setColor}
          placeholder="Cor (ex: #FF5733)"
          placeholderTextColor={colors.mutedLight}
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
          value={color}
        />
        <Pressable
          onPress={handleAdd}
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.addBtnTxt}>Adicionar</Text>
        </Pressable>
      </View>

      {categories.map((cat) => (
        <ListItem key={cat.id} accentColor={cat.color} description={cat.kind} title={cat.name} />
      ))}
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
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  kindRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  kindBtn: {
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  kindBtnTxt: {
    fontSize: typography.small,
    fontWeight: '600',
  },
  addBtn: {
    alignItems: 'center',
    borderRadius: radius.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  addBtnTxt: {
    color: '#fff',
    fontSize: typography.body,
    fontWeight: '700',
  },
});
