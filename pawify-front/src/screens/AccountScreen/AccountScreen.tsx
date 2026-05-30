import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Modal, TextInput, Alert, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useAppContext } from '../../context/AppContext';
import { useBuyerProfile } from '../../hooks/useBuyerProfile';
import { useCards } from '../../hooks/useCards';
import { useAddresses } from '../../hooks/useAddresses';
import { setAuthToken } from '../../config';
import { CardDTO } from '../../services/cardService';
import { AddressDTO } from '../../services/addressService';

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

interface InfoRowButtonProps {
  label: string;
  value: string;
  onPress: () => void;
}

const InfoRowButton: React.FC<InfoRowButtonProps> = ({ label, value, onPress }) => (
  <TouchableOpacity style={styles.infoRowButton} onPress={onPress}>
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color={colors.gray} />
  </TouchableOpacity>
);

interface CardModalProps {
  visible: boolean;
  onClose: () => void;
  cards: CardDTO[];
  loading: boolean;
  onAddCard: (data: { name: string; number: string; due_date: string }) => Promise<void>;
  onEditCard: (id: number, data: { name: string; number: string; due_date: string }) => Promise<void>;
  onSuccess: () => void;
}

const CardModal: React.FC<CardModalProps> = ({ visible, onClose, cards, loading, onAddCard, onEditCard, onSuccess }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<CardDTO | null>(null);
  const [formData, setFormData] = useState({ name: '', number: '', due_date: '' });
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({ name: '', number: '', due_date: '' });
    setEditingCard(null);
    setShowForm(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleEdit = (card: CardDTO) => {
    setEditingCard(card);
    setFormData({ name: card.name, number: card.number, due_date: card.due_date });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.number || !formData.due_date) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        due_date: formData.due_date,
        number: formData.number,
      };
      if (editingCard) {
        await onEditCard(editingCard.id, payload);
      } else {
        await onAddCard(payload);
      }
      resetForm();
      onSuccess();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Error al guardar tarjeta');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCardNumber = (number: string) => {
    return number.replace(/(\d{4})/g, '$1 ').trim();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tarjetas</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {!showForm ? (
            <>
              {loading ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : cards.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No tienes tarjetas registradas</Text>
                </View>
              ) : (
                <FlatList
                  data={cards}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.cardItem}>
                      <View style={styles.cardInfo}>
                        <Text style={styles.cardName}>{item.name}</Text>
                        <Text style={styles.cardNumber}>{formatCardNumber(item.number)}</Text>
                        <Text style={styles.cardDue}>Vence: {item.due_date}</Text>
                      </View>
                      <TouchableOpacity onPress={() => handleEdit(item)}>
                        <Ionicons name="pencil" size={20} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              )}
              <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
                <Ionicons name="add" size={24} color={colors.white} />
                <Text style={styles.addButtonText}>Agregar tarjeta</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>{editingCard ? 'Editar Tarjeta' : 'Nueva Tarjeta'}</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre en la tarjeta"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Numero de tarjeta (16 digitos)"
                value={formData.number}
                onChangeText={(text) => setFormData({ ...formData, number: text })}
                keyboardType="numeric"
                maxLength={16}
              />
              <TextInput
                style={styles.input}
                placeholder="Fecha de vencimiento (AAAA-MM)"
                value={formData.due_date}
                onChangeText={(text) => {
                  const numeric = text.replace(/\D/g, '');
                  if (numeric.length > 4) {
                    setFormData({ ...formData, due_date: numeric.slice(0, 4) + '-' + numeric.slice(4, 6) });
                  } else {
                    setFormData({ ...formData, due_date: numeric });
                  }
                }}
                keyboardType="numeric"
                maxLength={7}
              />
              <View style={styles.formButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
                  <Text style={styles.submitButtonText}>{submitting ? 'Guardando...' : 'Guardar'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

interface AddressModalProps {
  visible: boolean;
  onClose: () => void;
  addresses: AddressDTO[];
  loading: boolean;
  onAddAddress: (data: { name: string; reference: string; latitude: number; longitude: number }) => Promise<void>;
  onEditAddress: (id: number, data: { name: string; reference: string; latitude: number; longitude: number }) => Promise<void>;
  onSuccess: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({ visible, onClose, addresses, loading, onAddAddress, onEditAddress, onSuccess }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressDTO | null>(null);
  const [formData, setFormData] = useState({ name: '', reference: '' });
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({ name: '', reference: '' });
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleEdit = (address: AddressDTO) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      reference: address.reference,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.reference) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        reference: formData.reference,
        latitude: 0.1,
        longitude: 0.1,
      };
      if (editingAddress) {
        await onEditAddress(editingAddress.id, payload);
      } else {
        await onAddAddress(payload);
      }
      resetForm();
      onSuccess();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Error al guardar direccion');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Direcciones</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {!showForm ? (
            <>
              {loading ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : addresses.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No tienes direcciones registradas</Text>
                </View>
              ) : (
                <FlatList
                  data={addresses}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.addressItem}>
                      <View style={styles.addressInfo}>
                        <Text style={styles.addressName}>{item.name}</Text>
                        <Text style={styles.addressReference}>{item.reference}</Text>
                      </View>
                      <TouchableOpacity onPress={() => handleEdit(item)}>
                        <Ionicons name="pencil" size={20} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              )}
              <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
                <Ionicons name="add" size={24} color={colors.white} />
                <Text style={styles.addButtonText}>Agregar direccion</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>{editingAddress ? 'Editar Direccion' : 'Nueva Direccion'}</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre de la direccion"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Referencia"
                value={formData.reference}
                onChangeText={(text) => setFormData({ ...formData, reference: text })}
              />
              <View style={styles.formButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
                  <Text style={styles.submitButtonText}>{submitting ? 'Guardando...' : 'Guardar'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export const AccountScreen: React.FC = () => {
  const { currentUser, setActiveTab, setCurrentUser } = useAppContext();
  const isBuyer = currentUser?.role === 'BUYER';
  const { buyerData, loading: profileLoading, error, refetch: refetchBuyer } = useBuyerProfile(isBuyer ? currentUser?.token : undefined);
  const { cards, loading: cardsLoading, refetch: refetchCards, addCard, editCard } = useCards(isBuyer ? currentUser?.token : undefined);
  const { addresses, loading: addressesLoading, refetch: refetchAddresses, addAddress, editAddress } = useAddresses(isBuyer ? currentUser?.token : undefined);

  const [showCardsModal, setShowCardsModal] = useState(false);
  const [showAddressesModal, setShowAddressesModal] = useState(false);

  const handleBack = () => {
    setActiveTab('catalog');
  };

  const handleLogout = async () => {
    await setAuthToken(null);
    setCurrentUser(null);
  };

  const handleCardsSuccess = async () => {
    await Promise.all([refetchCards(), refetchBuyer()]);
  };

  const handleAddressesSuccess = async () => {
    await Promise.all([refetchAddresses(), refetchBuyer()]);
  };

  if (profileLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isBuyer) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi cuenta</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.userRoleText}>Usuario {currentUser?.role}</Text>
          <Text style={styles.usernameText}>@{currentUser?.username}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Cerrar sesion</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (error || !buyerData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi cuenta</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error al cargar perfil</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Cerrar sesion</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const fullName = `${buyerData.first_name} ${buyerData.last_name}`.trim();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi cuenta</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {buyerData.profile ? (
              <Image source={{ uri: buyerData.profile }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarIcon}>👤</Text>
              </View>
            )}
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="add" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <InfoRow label="Usuario" value={buyerData.username} />
          <View style={styles.divider} />
          <InfoRow label="Nombre completo" value={fullName} />
          <View style={styles.divider} />
          <InfoRow label="DNI" value={buyerData.dni_number} />
          <View style={styles.divider} />
          <InfoRowButton
            label="Tarjetas"
            value={`${buyerData.count_cards || 0} tarjeta(s)`}
            onPress={() => setShowCardsModal(true)}
          />
          <View style={styles.divider} />
          <InfoRowButton
            label="Direcciones"
            value={`${buyerData.count_addresses || 0} direccion(es)`}
            onPress={() => setShowAddressesModal(true)}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesion</Text>
        </TouchableOpacity>
      </ScrollView>

      <CardModal
        visible={showCardsModal}
        onClose={() => setShowCardsModal(false)}
        cards={cards}
        loading={cardsLoading}
        onAddCard={addCard}
        onEditCard={editCard}
        onSuccess={handleCardsSuccess}
      />

      <AddressModal
        visible={showAddressesModal}
        onClose={() => setShowAddressesModal(false)}
        addresses={addresses}
        loading={addressesLoading}
        onAddAddress={addAddress}
        onEditAddress={editAddress}
        onSuccess={handleAddressesSuccess}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  userRoleText: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 8,
  },
  usernameText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 15,
    backgroundColor: colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 100,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  avatarIcon: {
    fontSize: 50,
    color: colors.white,
  },
  cameraButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    paddingVertical: 14,
  },
  infoRowButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  logoutButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  cardDue: {
    fontSize: 12,
    color: colors.gray,
  },
  addressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  addressReference: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    margin: 16,
    padding: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    padding: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    color: colors.textPrimary,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.grayLight,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
