import * as SecureStore from 'expo-secure-store';

/** The storage key used to persist the authentication token. */
const TOKEN_KEY = 'pawify_auth_token';

/**
 * Persists the authentication token to the device's secure storage.
 *
 * @param token - The JWT token string to store.
 * @returns A promise that resolves when the token has been saved.
 */
export async function saveToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
}

/**
 * Retrieves the stored authentication token from secure storage.
 *
 * @returns A promise that resolves to the stored token string, or null if not found.
 */
export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
}

/**
 * Removes the authentication token from secure storage (logout).
 *
 * @returns A promise that resolves when the token has been deleted.
 */
export async function deleteToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error deleting token:', error);
  }
}
