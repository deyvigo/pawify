import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { useAppContext } from '../../context/AppContext';

export const PurchaseScreen: React.FC = () => {
  const { cartItems, cartTotal, cartCount, removeFromCart, updateQuantity, setCheckoutActive, setActiveTab } = useAppContext();

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.cartHeader}>
          <View style={styles.cartHeaderBtn} />
          <View style={styles.cartHeaderLogo}>
            <Text style={styles.cartHeaderEmoji}>🐾</Text>
            <Text style={styles.cartHeaderTitle}>Pawify</Text>
          </View>
          <View style={styles.cartHeaderBtn} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySubtitle}>
            Explora el catálogo y agrega productos para empezar a comprar
          </Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => setActiveTab('catalog')}>
            <Text style={styles.browseBtnText}>Ver catálogo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cartHeader}>
        <View style={styles.cartHeaderBtn} />
        <View style={styles.cartHeaderLogo}>
          <Text style={styles.cartHeaderEmoji}>🐾</Text>
          <Text style={styles.cartHeaderTitle}>Pawify</Text>
        </View>
        <View style={styles.cartHeaderBtn} />
      </View>

      <View style={styles.headerInfo}>
        <Text style={styles.screenTitle}>Carrito de compras</Text>
        <Text style={styles.itemCount}>{cartCount} {cartCount === 1 ? 'producto' : 'productos'}</Text>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {cartItems.map((item) => (
          <View key={item.product.productId} style={styles.cartItem}>
            <Image source={{ uri: item.product.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
              <Text style={styles.itemUnitPrice}>S/{item.product.price.toFixed(2)} c/u</Text>
              <View style={styles.quantityRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.product.productId, item.quantity - 1)}
                >
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.product.productId, item.quantity + 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemSubtotal}>
                S/{(item.product.price * item.quantity).toFixed(2)}
              </Text>
              <Text style={styles.itemUnitDetail}>
                {item.quantity} x S/{item.product.price.toFixed(2)}
              </Text>
              <TouchableOpacity onPress={() => removeFromCart(item.product.productId)}>
                <Text style={styles.removeText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.summaryLine}>
          <Text style={styles.summaryLineText}>Subtotal ({cartCount} items)</Text>
          <Text style={styles.summaryLinePrice}>S/{cartTotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>S/{cartTotal.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => setCheckoutActive(true)}
        >
          <Text style={styles.checkoutBtnText}>Ir al checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  cartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingVertical: 15,
    backgroundColor: colors.white,
  },
  cartHeaderBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartHeaderLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cartHeaderEmoji: {
    fontSize: 24,
  },
  cartHeaderTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  itemCount: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: '500',
  },
  browseBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 20,
  },
  browseBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  itemImage: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 14,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  itemUnitPrice: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray,
    marginBottom: 10,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 14,
    minWidth: 20,
    textAlign: 'center',
  },
  itemRight: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  itemSubtotal: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  itemUnitDetail: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.gray,
    marginBottom: 10,
  },
  removeText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryLineText: {
    fontSize: 13,
    color: colors.gray,
    fontWeight: '500',
  },
  summaryLinePrice: {
    fontSize: 13,
    color: colors.gray,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  checkoutBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
});
