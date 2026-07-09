import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { useAppContext } from "../../context/AppContext";
import { CartItem } from "../../types";
import { useStripePayment } from "../../hooks/use-stripe-payment";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { useAddress } from "../../hooks/use-address";
import { AddressModal } from "../../components/address-modal";

interface CheckoutScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  onBack,
  onSuccess,
}) => {
  const { cartItems, cartTotal, clearCart } = useAppContext();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [buyingStatus, setBuyingStatus] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const { data: addresses, isLoading: isLoadingAddresses } = useAddress();
  const { data: publishableKey, paymentIntentMutation } = useStripePayment();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const handleBuy = async () => {
    if (!selectedAddressId) {
      Alert.alert("Selecciona dirección", "Elige una dirección de envío");
      return;
    }

    const invalid = cartItems.find(
      (item) => !item.product.productId || item.product.productId <= 0,
    );
    if (invalid) {
      Alert.alert(
        "Error",
        "Hay productos inválidos en el carrito. Vuelve a agregarlos.",
      );
      return;
    }
    setBuyingStatus(true);
    try {
      const { client_secret, customer_id, ephemeral_key, payment_intent_id } =
        await paymentIntentMutation.mutateAsync({
          details: cartItems.map((item: CartItem) => ({
            product_id: item.product.productId,
            quantity: item.quantity,
          })),
        });

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "Pawify",
        customerId: customer_id,
        customerEphemeralKeySecret: ephemeral_key,
        paymentIntentClientSecret: client_secret,
        allowsDelayedPaymentMethods: false,
      });

      if (initError) {
        Alert.alert("Error", initError.message);
      }
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        Alert.alert("Error", presentError.message);
      }

      clearCart();
      onSuccess();
    } catch {
      Alert.alert(
        "Error",
        "No se pudo completar la compra. Intenta nuevamente.",
      );
    } finally {
      setBuyingStatus(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <StripeProvider publishableKey={publishableKey?.publishable_key!}>
      <View style={styles.container}>
        <View style={styles.cartHeader}>
          <TouchableOpacity onPress={onBack} style={styles.cartHeaderBtn}>
            <Ionicons name="arrow-back" size={26} color={colors.black} />
          </TouchableOpacity>
          <View style={styles.cartHeaderLogo}>
            <Text style={styles.cartHeaderEmoji}>🐾</Text>
            <Text style={styles.cartHeaderTitle}>Pawify</Text>
          </View>
          <View style={styles.cartHeaderBtn} />
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Dirección de envío</Text>
          {isLoadingAddresses ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              {addresses?.map((addr) => (
                <View
                  key={addr.id}
                  style={[
                    styles.optionCard,
                    selectedAddressId === addr.id && styles.optionCardSelected,
                  ]}>
                  <TouchableOpacity
                    style={styles.optionCardTouchable}
                    onPress={() => setSelectedAddressId(addr.id)}>
                    <View style={styles.radioOuter}>
                      {selectedAddressId === addr.id && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <View style={styles.optionContent}>
                      <Text style={styles.optionTitle}>{addr.name}</Text>
                      <Text style={styles.optionSub}>{addr.reference}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => setShowAddressModal(true)}>
                <Text style={styles.addBtnText}>+ Agregar dirección</Text>
              </TouchableOpacity>
            </>
          )}

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Resumen</Text>
          <View style={styles.summaryCard}>
            {cartItems.map((item) => (
              <View key={item.product.productId} style={styles.summaryRow}>
                <Text style={styles.summaryName} numberOfLines={1}>
                  {item.quantity}x {item.product.name}
                </Text>
                <Text style={styles.summaryPrice}>
                  S/{(item.product.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalPrice}>
                S/{cartTotal.toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.buyBtn, buyingStatus && styles.buyBtnDisabled]}
            onPress={handleBuy}
            disabled={buyingStatus}>
            {buyingStatus ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.buyBtnText}>
                Comprar — S/{cartTotal.toFixed(2)}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <AddressModal
          visible={showAddressModal}
          onClose={() => setShowAddressModal(false)}
        />
      </View>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  backBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  cartHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingVertical: 15,
    backgroundColor: colors.white,
  },
  cartHeaderBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  cartHeaderLogo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cartHeaderEmoji: {
    fontSize: 24,
  },
  cartHeaderTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  optionCardSelected: {
    borderColor: colors.primary,
  },
  optionCardTouchable: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  optionSub: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  addBtn: {
    paddingVertical: 10,
  },
  addBtnText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryName: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  summaryPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  summaryTotalPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  buyBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  buyBtnDisabled: {
    opacity: 0.6,
  },
  buyBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
