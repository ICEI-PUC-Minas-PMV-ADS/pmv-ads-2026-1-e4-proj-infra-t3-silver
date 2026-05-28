import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { radius, spacing, typography } from '../theme/theme';

interface ReceiptPickerProps {
  uri: string | null;
  onChange: (uri: string | null) => void;
}

export function ReceiptPicker({ uri, onChange }: ReceiptPickerProps) {
  const { colors } = useTheme();

  async function handleCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita o acesso à câmera nas configurações do dispositivo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.7 });
    if (!result.canceled) onChange(result.assets[0].uri);
  }

  async function handleGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita o acesso à galeria nas configurações do dispositivo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'] as ImagePicker.MediaType[],
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) onChange(result.assets[0].uri);
  }

  function handleRemove() {
    Alert.alert('Remover comprovante', 'Deseja remover a foto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => onChange(null) },
    ]);
  }

  return (
    <View>
      <Text style={[styles.label, { color: colors.text }]}>
        {uri ? 'Comprovante' : 'Comprovante (opcional)'}
      </Text>

      {uri ? (
        <>
          <Image resizeMode="cover" source={{ uri }} style={styles.image} />
          <Pressable onPress={handleRemove} style={styles.removeButton}>
            <Text style={[styles.removeText, { color: colors.danger }]}>Remover foto</Text>
          </Pressable>
        </>
      ) : (
        <View style={[styles.placeholder, { borderColor: colors.border }]}>
          <Pressable onPress={handleCamera} style={styles.actionButton}>
            <Text style={[styles.actionText, { color: colors.primary }]}>Tirar foto</Text>
          </Pressable>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Pressable onPress={handleGallery} style={styles.actionButton}>
            <Text style={[styles.actionText, { color: colors.primary }]}>Escolher da galeria</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: typography.small,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  placeholder: {
    borderRadius: radius.md,
    borderStyle: 'dashed',
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  actionText: {
    fontSize: typography.small,
    fontWeight: '600',
  },
  divider: {
    width: 1,
  },
  image: {
    borderRadius: radius.md,
    height: 180,
    width: '100%',
  },
  removeButton: {
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingVertical: spacing.xs,
  },
  removeText: {
    fontSize: typography.small,
    fontWeight: '600',
  },
});
