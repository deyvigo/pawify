import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '../types';

/** The storage key used to persist the shopping cart. */
const CART_KEY = 'pawify_cart';

/**
 * Loads the shopping cart from local async storage.
 *
 * Filters out any items with invalid or missing product data.
 *
 * @returns A promise that resolves to an array of valid cart items, or an empty array on error.
 */
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

/**
 * Persists the shopping cart to local async storage.
 *
 * @param items - The array of cart items to save.
 * @returns A promise that resolves when the cart has been saved.
 */
export async function saveCartToStorage(items: CartItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving cart:', e);
  }
}
