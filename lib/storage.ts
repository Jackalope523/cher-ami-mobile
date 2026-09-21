import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  deleteItemAsync,
  getItemAsync,
  setItemAsync,
} from 'expo-secure-store';

/**
 * The token and onboarding flag live in the keychain. Reads still check
 * AsyncStorage once and move anything they find across, so upgrading doesn't
 * sign out everyone who was signed in before.
 *
 * Every call falls back to AsyncStorage if the keychain is unavailable: staying
 * signed in matters more here than the stronger store, and this is the
 * behaviour the app already had.
 */
export async function readSecure(key: string): Promise<string | null> {
  try {
    const secure = await getItemAsync(key);
    if (secure !== null) return secure;
  } catch {
    // Fall through to the legacy store.
  }

  const legacy = await AsyncStorage.getItem(key);

  if (legacy !== null) {
    await writeSecure(key, legacy);
    await AsyncStorage.removeItem(key);
  }

  return legacy;
}

export async function writeSecure(key: string, value: string) {
  try {
    await setItemAsync(key, value);
  } catch {
    await AsyncStorage.setItem(key, value);
  }
}

export async function removeSecure(key: string) {
  try {
    await deleteItemAsync(key);
  } catch {
    // Ignore — the AsyncStorage removal below is what matters then.
  }

  await AsyncStorage.removeItem(key);
}
