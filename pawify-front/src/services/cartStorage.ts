import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '../types';

// Clave de storage para el carrito de compras
const CART_KEY = 'pawify_cart';

// Carga el carrito desde el storage local, filtra items invalidos
export async function loadCartFromStorage(): Promise<CartItem[]> {
  try {
    const data = await AsyncStorage.getItem(CART_KEY);
    if (!data) return [];
    const items: CartItem[] = JSON.parse(data);
    return items.filter(item => item.product && typeof item.product.productId === 'number' && item.product.productId > 0);
  } catch {
    return [];
  }
}

// Guarda el carrito en el storage local
export async function saveCartToStorage(items: CartItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving cart:', e);
  }
}
