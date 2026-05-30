import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { StarRating } from "../../components/StarRating";
import { InteractiveStarRating } from "../../components/InteractiveStarRating";
import { Product } from "../../types/product";
import { Header } from "../../components/Header";
import { useAppContext } from "../../context/AppContext";

const { width } = Dimensions.get("window");

interface LocalReview {
  id: string;
  content: string;
  rating: number;
  created_at: string;
  buyer: {
    first_name: string;
    last_name: string;
  };
}

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string, rating: number) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ visible, onClose, onSubmit }) => {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!content.trim()) {
      Alert.alert("Error", "Por favor escribe una descripcion");
      return;
    }
    if (rating === 0) {
      Alert.alert("Error", "Por favor selecciona una calificacion");
      return;
    }

    setSubmitting(true);
    try {
      onSubmit(content.trim(), rating);
      setContent("");
      setRating(0);
      onClose();
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Error al enviar resena");
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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nueva Resena</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.inputLabel}>Calificacion</Text>
            <InteractiveStarRating rating={rating} onRatingChange={setRating} size={36} />

            <Text style={[styles.inputLabel, { marginTop: 20 }]}>Tu resena</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Escribe tu experiencia con el producto..."
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>Enviar Resena</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

interface ReviewItemProps {
  review: LocalReview;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => (
  <View style={styles.reviewItem}>
    <View style={styles.reviewHeader}>
      <View>
        <Text style={styles.reviewerName}>
          {review.buyer.first_name} {review.buyer.last_name}
        </Text>
        <Text style={styles.reviewDate}>
          {new Date(review.created_at).toLocaleDateString()}
        </Text>
      </View>
      <StarRating rating={review.rating} size={12} />
    </View>
    <Text style={styles.reviewText}>{review.content}</Text>
  </View>
);

interface ProductDetailScreenProps {
  product: Product;
  onBack: () => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  onBack,
}) => {
  const { currentUser } = useAppContext();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState<LocalReview[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const scrollNext = () => {
    if (activeImageIndex < product.images.length - 1) {
      const nextIndex = activeImageIndex + 1;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setActiveImageIndex(nextIndex);
    }
  };

  const scrollPrev = () => {
    if (activeImageIndex > 0) {
      const prevIndex = activeImageIndex - 1;
      scrollRef.current?.scrollTo({ x: prevIndex * width, animated: true });
      setActiveImageIndex(prevIndex);
    }
  };

  const handleAddReview = (content: string, rating: number) => {
    const firstName = currentUser?.first_name || "Usuario";
    const lastName = currentUser?.last_name || "";

    const newReview: LocalReview = {
      id: Date.now().toString(),
      content,
      rating,
      created_at: new Date().toISOString(),
      buyer: {
        first_name: firstName,
        last_name: lastName,
      },
    };

    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onActionPress={onBack} variant="detail" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = Math.round(e.nativeEvent.contentOffset.x / width);
              if (slide !== activeImageIndex) setActiveImageIndex(slide);
            }}
            scrollEventThrottle={16}
          >
            {product.images.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={styles.productImage} />
            ))}
          </ScrollView>
          
          <TouchableOpacity
            style={[styles.carouselArrowLeft, activeImageIndex === 0 && { opacity: 0.3 }]}
            onPress={scrollPrev}
            disabled={activeImageIndex === 0}
          >
            <Text style={styles.arrowText}>{"<"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.carouselArrowRight,
              activeImageIndex === product.images.length - 1 && { opacity: 0.3 },
            ]}
            onPress={scrollNext}
            disabled={activeImageIndex === product.images.length - 1}
          >
            <Text style={styles.arrowText}>{">"}</Text>
          </TouchableOpacity>

          <View style={styles.indicators}>
            {product.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === activeImageIndex && styles.indicatorActive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{product.name}</Text>
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>{product.stock} en stock</Text>
            </View>
          </View>
          
          <View style={styles.ratingRow}>
            <StarRating rating={product.rating} />
            <Text style={styles.ratingText}>
              {product.rating.toFixed(1)} ({product.sold} ventas)
            </Text>
            <Text style={styles.shareCode}>#{product.share_code}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>S/{product.price.toFixed(2)}</Text>
            <View style={styles.activeBadge}>
               <Text style={styles.activeText}>Active</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Descripcion</Text>
          <Text style={styles.description}>
            {product.description}. Este producto de alta calidad de la marca {product.brand || "Pawify"} 
            ha sido disenado pensando en el bienestar y la comodidad de tu mascota. 
            Fabricado con materiales duraderos y seguros para garantizar una larga vida util y la mejor experiencia para tu companero fiel.
          </Text>

          <View style={styles.tagsContainer}>
            {product.category && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{product.category}</Text>
              </View>
            )}
            {product.sub_category && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{product.sub_category}</Text>
              </View>
            )}
            {product.brand && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{product.brand}</Text>
              </View>
            )}
          </View>

          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Resenas</Text>
            <TouchableOpacity style={styles.addReviewButton} onPress={() => setShowReviewModal(true)}>
              <Ionicons name="add" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.reviewsContainer}>
            {reviews.length === 0 ? (
              <Text style={styles.noReviewsText}>Sin resenas aun</Text>
            ) : (
              reviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={handleDecrease} style={styles.quantityBtn}>
            <Text style={styles.quantityBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={handleIncrease} style={styles.quantityBtn}>
            <Text style={styles.quantityBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.addToCartBtn}>
          <Text style={styles.cartIcon}>🛒</Text>
          <Text style={styles.addToCartText}>Anadir al carrito</Text>
        </TouchableOpacity>
      </View>

      <ReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleAddReview}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  carouselContainer: {
    width: width,
    height: 300,
    position: "relative",
  },
  productImage: {
    width: width,
    height: 300,
    resizeMode: "cover",
  },
  carouselArrowLeft: {
    position: "absolute",
    left: 20,
    top: "50%",
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  carouselArrowRight: {
    position: "absolute",
    right: 20,
    top: "50%",
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  arrowText: {
    fontSize: 20,
    color: "#333",
  },
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    width: "100%",
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
  },
  indicatorActive: {
    width: 20,
    backgroundColor: "#333",
  },
  infoContainer: {
    padding: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textPrimary,
    flex: 1,
  },
  stockBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 10,
  },
  stockText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "600",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  shareCode: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: "500",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  activeBadge: {
    backgroundColor: colors.success + "20",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 10,
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 15,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 25,
  },
  tag: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: "capitalize",
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  addReviewButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  reviewsContainer: {
    marginTop: 5,
  },
  reviewItem: {
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  reviewDate: {
    fontSize: 11,
    color: colors.gray,
    marginTop: 2,
  },
  reviewText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  noReviewsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    paddingVertical: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 20,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    alignItems: "center",
    gap: 15,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 50,
  },
  quantityBtn: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityBtnText: {
    fontSize: 20,
    color: colors.textPrimary,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 15,
    minWidth: 20,
    textAlign: "center",
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  cartIcon: {
    fontSize: 18,
    color: colors.white,
  },
  addToCartText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
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
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
