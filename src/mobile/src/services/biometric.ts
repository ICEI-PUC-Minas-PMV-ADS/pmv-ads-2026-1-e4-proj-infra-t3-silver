import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const CREDENTIALS_KEY = 'silver_biometric_credentials';

type StoredCredentials = { email: string; password: string };

export async function isBiometricAvailable(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return hasHardware && isEnrolled;
}

export async function hasBiometricCredentials(): Promise<boolean> {
  try {
    const stored = await SecureStore.getItemAsync(CREDENTIALS_KEY);
    return stored !== null;
  } catch {
    return false;
  }
}

export async function authenticateWithBiometric(): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Autentique-se para acessar o Silver',
    fallbackLabel: 'Usar senha',
    cancelLabel: 'Cancelar',
    disableDeviceFallback: false,
  });
  return result.success;
}

export async function saveBiometricCredentials(email: string, password: string): Promise<void> {
  await SecureStore.setItemAsync(CREDENTIALS_KEY, JSON.stringify({ email, password }));
}

export async function getBiometricCredentials(): Promise<StoredCredentials | null> {
  try {
    const stored = await SecureStore.getItemAsync(CREDENTIALS_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as StoredCredentials;
  } catch {
    return null;
  }
}

export async function clearBiometricCredentials(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
  } catch {
    // ignora se a chave não existir
  }
}
