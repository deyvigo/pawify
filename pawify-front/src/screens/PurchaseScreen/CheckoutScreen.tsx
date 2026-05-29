import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, TextInput, Modal, KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useAppContext } from '../../context/AppContext';
import { getAddresses, createAddress, deactivateAddress } from '../../services/addressService';
import { getCards, createCard, deactivateCard } from '../../services/cardService';
import { createOrder } from '../../services/orderService';
import { AddressResponseDTO, CardResponseDTO, CartItem } from '../../types';

interface CheckoutScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ onBack, onSuccess }) => {
  const { cartItems, cartTotal, clearCart } = useAppContext();

  const [addresses, setAddresses] = useState<AddressResponseDTO[]>([]);
  const [cards, setCards] = useState<CardResponseDTO[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [loadingCards, setLoadingCards] = useState(true);
  const [buying, setBuying] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);

  const [newAddress, setNewAddress] = useState({ name: '', reference: '', latitude: '', longitude: '' });
  const [newCard, setNewCard] = useState({ name: '', number: '', due_date: '' });
  const [addingAddress, setAddingAddress] = useState(false);
  const [addingCard, setAddingCard] = useState(false);

  useEffect(() => {
    loadAddresses();
    loadCards();
  }, []);

  const loadAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch {
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const loadCards = async () => {
    setLoadingCards(true);
    try {
      const data = await getCards();
      setCards(data);
    } catch {
      setCards([]);
    } finally {
      setLoadingCards(false);
    }
  };

  const handleCreateAddress = async () => {
    const lat = parseFloat(newAddress.latitude);
    const lng = parseFloat(newAddress.longitude);
    if (!newAddress.name.trim() || !newAddress.reference.trim() || isNaN(lat) || isNaN(lng)) {
      Alert.alert('Error', 'Completa todos los campos correctamente');
      return;
    }
    setAddingAddress(true);
    try {
      const created = await createAddress({
        name: newAddress.name.trim(),
        reference: newAddress.reference.trim(),
        latitude: lat,
        longitude: lng,
      });
      setAddresses(prev => [...prev, created]);
      setSelectedAddressId(created.id);
      setShowAddressForm(false);
      setNewAddress({ name: '', reference: '', latitude: '', longitude: '' });
    } catch {
      Alert.alert('Error', 'No se pudo crear la dirección');
    } finally {
      setAddingAddress(false);
    }
  };

  const handleCreateCard = async () => {
    const numberClean = newCard.number.replace(/\s/g, '');
    if (!newCard.name.trim() || numberClean.length !== 16 || !newCard.due_date.trim()) {
      Alert.alert('Error', 'Completa todos los campos correctamente');
      return;
    }
    setAddingCard(true);
    try {
      const created = await createCard({
        name: newCard.name.trim(),
        number: numberClean,
        due_date: newCard.due_date.trim(),
      });
      setCards(prev => [...prev, created]);
      setSelectedCardId(created.id);
      setShowCardForm(false);
      setNewCard({ name: '', number: '', due_date: '' });
    } catch {
      Alert.alert('Error', 'No se pudo guardar la tarjeta');
    } finally {
      setAddingCard(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await deactivateAddress(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
      if (selectedAddressId === id) setSelectedAddressId(null);
    } catch {
      Alert.alert('Error', 'No se pudo eliminar la dirección');
    }
  };

  const handleDeleteCard = async (id: number) => {
    try {
      await deactivateCard(id);
      setCards(prev => prev.filter(c => c.id !== id));
      if (selectedCardId === id) setSelectedCardId(null);
    } catch {
      Alert.alert('Error', 'No se pudo eliminar la tarjeta');
    }
  };

  const handleBuy = async () => {
    if (!selectedAddressId) {
      Alert.alert('Selecciona dirección', 'Elige una dirección de envío');
      return;
    }
    if (!selectedCardId) {
      Alert.alert('Selecciona método de pago', 'Elige una tarjeta');
      return;
    }

    const invalid = cartItems.find(item => !item.product.productId || item.product.productId <= 0);
    if (invalid) {
      Alert.alert('Error', 'Hay productos inválidos en el carrito. Vuelve a agregarlos.');
      return;
    }
    setBuying(true);
    try {
      const details = cartItems.map((item: CartItem) => ({
        product_id: item.product.productId,
        quantity: item.quantity,
      }));
      await createOrder({ details });
      clearCart();
      Alert.alert('Compra exitosa', 'Tu orden ha sido creada correctamente');
      onSuccess();
    } catch {
      Alert.alert('Error', 'No se pudo completar la compra. Intenta nuevamente.');
    } finally {
      setBuying(false);
    }
  };

  const maskCardNumber = (num: string) => {
    const last4 = num.slice(-4);
    return `**** **** **** ${last4}`;
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

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Dirección de envío</Text>
        {loadingAddresses ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <>
            {addresses.map(addr => (
              <View key={addr.id} style={[styles.optionCard, selectedAddressId === addr.id && styles.optionCardSelected]}>
                <TouchableOpacity
                  style={styles.optionCardTouchable}
                  onPress={() => setSelectedAddressId(addr.id)}
                >
                  <View style={styles.radioOuter}>
                    {selectedAddressId === addr.id && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>{addr.name}</Text>
                    <Text style={styles.optionSub}>{addr.reference}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteAddress(addr.id)} style={styles.deleteBtn}>
                  <Text style={styles.deleteBtnText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddressForm(true)}>
              <Text style={styles.addBtnText}>+ Agregar dirección</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Método de pago</Text>
        {loadingCards ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <>
            {cards.map(card => (
              <View key={card.id} style={[styles.optionCard, selectedCardId === card.id && styles.optionCardSelected]}>
                <TouchableOpacity
                  style={styles.optionCardTouchable}
                  onPress={() => setSelectedCardId(card.id)}
                >
                  <View style={styles.radioOuter}>
                    {selectedCardId === card.id && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>{card.name}</Text>
                    <Text style={styles.optionSub}>{maskCardNumber(card.number)}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteCard(card.id)} style={styles.deleteBtn}>
                  <Text style={styles.deleteBtnText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addBtn} onPress={() => setShowCardForm(true)}>
              <Text style={styles.addBtnText}>+ Agregar tarjeta</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Resumen</Text>
        <View style={styles.summaryCard}>
          {cartItems.map(item => (
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
            <Text style={styles.summaryTotalPrice}>S/{cartTotal.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.buyBtn, buying && styles.buyBtnDisabled]}
          onPress={handleBuy}
          disabled={buying}
        >
          {buying ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.buyBtnText}>Comprar — S/{cartTotal.toFixed(2)}</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal visible={showAddressForm} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva dirección</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre (ej: Casa)"
              value={newAddress.name}
              onChangeText={t => setNewAddress(p => ({ ...p, name: t }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Referencia"
              value={newAddress.reference}
              onChangeText={t => setNewAddress(p => ({ ...p, reference: t }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Latitud"
              keyboardType="decimal-pad"
              value={newAddress.latitude}
              onChangeText={t => setNewAddress(p => ({ ...p, latitude: t }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Longitud"
              keyboardType="decimal-pad"
              value={newAddress.longitude}
              onChangeText={t => setNewAddress(p => ({ ...p, longitude: t }))}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowAddressForm(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveBtn, addingAddress && styles.buyBtnDisabled]}
                onPress={handleCreateAddress}
                disabled={addingAddress}
              >
                {addingAddress ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.modalSaveText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={showCardForm} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva tarjeta</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del titular"
              value={newCard.name}
              onChangeText={t => setNewCard(p => ({ ...p, name: t }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Número (16 dígitos)"
              keyboardType="number-pad"
              maxLength={16}
              value={newCard.number}
              onChangeText={t => setNewCard(p => ({ ...p, number: t }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Vencimiento (YYYY-MM)"
              value={newCard.due_date}
              onChangeText={t => setNewCard(p => ({ ...p, due_date: t }))}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowCardForm(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveBtn, addingCard && styles.buyBtnDisabled]}
                onPress={handleCreateCard}
                disabled={addingCard}
              >
                {addingCard ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.modalSaveText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    fontWeight: '600',
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
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deleteBtn: {
    paddingLeft: 12,
    paddingVertical: 4,
  },
  deleteBtnText: {
    fontSize: 12,
    color: colors.error,
    fontWeight: '500',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: '600',
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
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontWeight: '600',
    color: colors.textPrimary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  summaryTotalPrice: {
    fontSize: 20,
    fontWeight: '700',
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
    alignItems: 'center',
  },
  buyBtnDisabled: {
    opacity: 0.6,
  },
  buyBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  modalSaveBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  modalSaveText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
});
