import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '../types';

const CART_KEY = 'pawify_cart';

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

export async function saveCartToStorage(items: CartItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving cart:', e);
  }
}
