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
} from "react-native";
import { colors } from "../../theme/colors";
import { StarRating } from "../../components/StarRating";
import { Product } from "../../types/product";
import { Header } from "../../components/Header";

const pawLogo = require("../../../assets/pawlogo.png");
const pawTxtLogo = require("../../../assets/pawtxtlogo.png");

const { width } = Dimensions.get("window");

// Removed local Product interface

interface ProductDetailScreenProps {
  product: Product;
  onBack: () => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  onBack,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header onActionPress={onBack} variant="detail" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image Carousel */}
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
          
          {/* Carousel Arrows */}
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

          {/* Carousel Indicators */}
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

        {/* Product Info */}
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
            ha sido diseñado pensando en el bienestar y la comodidad de tu mascota. 
            Fabricado con materiales duraderos y seguros para garantizar una larga vida útil y la mejor experiencia para tu compañero fiel.
          </Text>

          {/* Tags Section */}
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

          <Text style={styles.sectionTitle}>Reseñas</Text>
          <View style={styles.reviewsContainer}>
            <View style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>Juan Perez</Text>
                <StarRating rating={5} size={10} />
              </View>
              <Text style={styles.reviewText}>
                Excelente producto, a mi mascota le encantó desde el primer día. Muy recomendado!
              </Text>
            </View>
            <View style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>Maria Garcia</Text>
                <StarRating rating={4} size={10} />
              </View>
              <Text style={styles.reviewText}>
                Muy buena calidad y el envío fue rápido. El tamaño es perfecto.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer / Add to Cart */}
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
          <Text style={styles.addToCartText}>Añadir al carrito</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 60,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
    borderRadius: 15,
  },
  // Redundant header styles removed
  heartIcon: {
    fontSize: 24,
    color: colors.textPrimary,
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
    backgroundColor: colors.success + "20", // 20% opacity
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
  reviewText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
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
});
