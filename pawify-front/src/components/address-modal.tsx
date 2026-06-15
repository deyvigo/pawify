import { useState } from "react";
import { AddressCreateRequestDTO, AddressResponseDTO } from "../types";
import { useAddress } from "../hooks/use-address";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../theme/colors";
import { useQueryClient } from "@tanstack/react-query";

interface AddressModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddressModal = ({ visible, onClose }: AddressModalProps) => {
  const [address, setAddress] = useState<AddressCreateRequestDTO>({
    name: "",
    reference: "",
    latitude: 0.1,
    longitude: 0.1,
  });

  const queryClient = useQueryClient();
  const { addressMutation } = useAddress();
  const addingAddress = addressMutation.isPending;

  const handleCreateAddress = async () => {
    if (!address.name.trim() || !address.reference.trim()) {
      Alert.alert("Error", "Completa todos los campos correctamente");
    }

    addressMutation.mutate(address, {
      onSuccess: (newAddress) => {
        queryClient.setQueryData<AddressResponseDTO[]>(["address"], (prev) =>
          prev ? [...prev, newAddress] : [newAddress],
        );
        onClose();
      },
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Nueva dirección</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre (ej: Casa)"
            value={address.name}
            onChangeText={(t) => setAddress((p) => ({ ...p, name: t }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Referencia"
            value={address.reference}
            onChangeText={(t) => setAddress((p) => ({ ...p, reference: t }))}
          />
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={onClose}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalSaveBtn,
                addingAddress && styles.buyBtnDisabled,
              ]}
              onPress={handleCreateAddress}
              disabled={addingAddress}>
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
  );
};

const styles = StyleSheet.create({
  buyBtnDisabled: {
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
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
    fontWeight: "700",
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
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalCancelBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  modalSaveBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  modalSaveText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.white,
  },
});
