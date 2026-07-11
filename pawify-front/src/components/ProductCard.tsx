import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { colors } from "../theme/colors";
import { StarRating } from "./StarRating";
import { Product } from "../types/product";
import { getReviews } from "../services/reviewService";

const statsCache = new Map<number, { rating: number; sold: number }>();


interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onPress: (product: Product) => void;
  style?: ViewStyle;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onPress,
  style,
}) => {
  const [stats, setStats] = useState(() => {
    if (statsCache.has(product.productId)) {
      return statsCache.get(product.productId)!;
    }
    return { rating: product.rating || 0, sold: product.sold || 0 };
  });

  // 3. Efecto ligero: Solo consulta si NO está en caché
  useEffect(() => {
    let isMounted = true;

    const fetchRealStats = async () => {
      if (!statsCache.has(product.productId)) {
        try {
          // Pedimos 50 de golpe solo para intentar tener el promedio más exacto posible.
          // Esto no usa tu hook, usa tu servicio directamente para no contaminar estados.
          const response = await getReviews(product.productId, 0, 50);
          const reviews = response.content;

          if (isMounted) {
            if (reviews.length > 0) {
              const totalStars = reviews.reduce((acc, curr) => acc + curr.rating, 0);
              const averageRating = totalStars / reviews.length;
              
              const newStats = {
                rating: averageRating,
                sold: Math.max(product.sold, reviews.length),
              };
              
              // Guardamos en caché y actualizamos la UI
              statsCache.set(product.productId, newStats);
              setStats(newStats);
            } else {
              // Si no hay reseñas, guardamos los valores por defecto en caché
              // para no volver a consultar al backend por gusto.
              const defaultStats = { rating: product.rating || 0, sold: product.sold || 0 };
              statsCache.set(product.productId, defaultStats);
              setStats(defaultStats);
            }
          }
        } catch (error) {
          console.error(`Error silencioso cargando reseñas para el producto ${product.productId}`, error);
        }
      }
    };

    fetchRealStats();

    return () => {
      isMounted = false; // Cleanup para evitar actualizar componentes desmontados
    };
  }, [product.productId, product.rating, product.sold]);
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.container, style]}
      onPress={() => onPress(product)}
    >
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.infoRow}>
          <Text style={styles.soldText}>{stats.sold} vendidos</Text>
          <StarRating rating={stats.rating} />
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>S/{product.price.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => onAddToCart(product)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 0,
  },
  image: {
    width: "100%",
    height: 120,
  },
  content: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  soldText: {
    fontSize: 11,
    color: colors.gray,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 20,
  },
});
