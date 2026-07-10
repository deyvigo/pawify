import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { InteractiveStarRating } from "./InteractiveStarRating";
import { StarRating } from "./StarRating";
import { ReviewDTO } from "../services/reviewService";

interface ReviewFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (content: string, rating: number) => Promise<void>;
  readOnly?: boolean;
  review?: ReviewDTO;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  visible,
  onClose,
  onSubmit,
  readOnly = false,
  review,
}) => {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Por favor escribe una descripción");
      return;
    }
    if (rating === 0) {
      Alert.alert("Error", "Por favor selecciona una calificación");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit?.(content.trim(), rating);
      setContent("");
      setRating(0);
      onClose();
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Error al enviar reseña");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setContent("");
    setRating(0);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {readOnly ? "Reseña" : "Nueva Reseña"}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {readOnly && review ? (
            <View style={styles.body}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>
                  {review.buyer.first_name} {review.buyer.last_name}
                </Text>
                <Text style={styles.reviewDate}>
                  {new Date(review.created_at).toLocaleDateString()}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-start', marginTop: 4 }}>
                <StarRating rating={review.rating} size={20} />
              </View>
              <Text style={styles.reviewContent}>{review.content}</Text>
            </View>
          ) : readOnly ? (
            <View style={styles.body}>
              <View style={styles.emptyReview}>
                <Ionicons name="checkmark-circle" size={48} color={colors.success} />
                <Text style={styles.emptyReviewText}>Ya has reseñado este producto</Text>
              </View>
            </View>
          ) : (
            <View style={styles.body}>
              <Text style={styles.label}>Calificación</Text>
              <InteractiveStarRating rating={rating} onRatingChange={setRating} size={36} />

              <Text style={[styles.label, { marginTop: 20 }]}>Tu reseña</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Describe tu experiencia..."
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={[styles.submitButton, submitting && styles.submitDisabled]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.submitText}>Enviar Reseña</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  body: {
    padding: 20,
  },
  reviewHeader: {
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
  reviewContent: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 16,
  },
  emptyReview: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyReviewText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 120,
    color: colors.textPrimary,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
