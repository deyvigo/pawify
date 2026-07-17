import * as SecureStore from 'expo-secure-store';

// Clave de storage para el token de autenticacion
const TOKEN_KEY = 'pawify_auth_token';

// Guarda el token JWT en el storage seguro del dispositivo
export async function saveToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
}

// Obtiene el token JWT del storage seguro
export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
}

// Elimina el token JWT del storage seguro (logout)
export async function deleteToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error deleting token:', error);
  }
}
