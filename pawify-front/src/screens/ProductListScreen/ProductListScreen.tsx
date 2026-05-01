import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Alert,
} from "react-native";
import { colors } from "../../theme/colors";
import { Header, SearchBar, FilterButton, ProductCard } from "../../components";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  sold: number;
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Alimento Premium para Perro",
    image:
      "https://www.superpet.pe/perro/alimentos-y-snacks/snack-y-premios/carnitas-tradicional-250g/PP000207.html?srsltid=AfmBOorP0GU9SVycAGRjxWEKSnaYRzjEZDqC7lqOqo5zdGO2Q64pUOi6",
    price: 45.99,
    rating: 5,
    sold: 234,
  },
  {
    id: "2",
    name: "Juguete Hueso de Goma",
    image:
      "https://i0.wp.com/cat-oh.com/wp-content/uploads/2022/02/7070_arnes_para_gato_5.webp?resize=317%2C317&ssl=1",
    price: 12.5,
    rating: 4,
    sold: 189,
  },
  {
    id: "3",
    name: "Cama Acolchada para Gato",
    image: "https://picsum.photos/seed/cama/300/300",
    price: 67.0,
    rating: 5,
    sold: 312,
  },
  {
    id: "4",
    name: "Collar Antipulgas",
    image: "https://picsum.photos/seed/collar/300/300",
    price: 22.99,
    rating: 3,
    sold: 156,
  },
  {
    id: "5",
    name: "Snacks Naturales para Perro",
    image: "https://picsum.photos/seed/snacks/300/300",
    price: 8.99,
    rating: 4,
    sold: 421,
  },
  {
    id: "6",
    name: "Arena Aglomerante para Gato",
    image: "https://picsum.photos/seed/arena/300/300",
    price: 15.5,
    rating: 4,
    sold: 278,
  },
];

const GAP = 10;
const HORIZONTAL_PADDING = 16;

export const ProductListScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { width } = useWindowDimensions();

  const cardWidth = (width - HORIZONTAL_PADDING * 2 - GAP) / 2;

  const handleAddToCart = (product: Product) => {
    Alert.alert("Agregado", `${product.name} se agregó al carrito`);
  };

  const handleFilter = () => {
    Alert.alert("Filtro", "Abrir opciones de filtro");
  };

  const handleSort = () => {
    Alert.alert("Ordenar", "Abrir opciones de ordenamiento");
  };

  const filteredProducts = mockProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <Header onMenuPress={() => Alert.alert("Menu", "Abrir menú lateral")} />
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <View style={styles.filterRow}>
        <FilterButton label="Filtro" icon="ᯤ" onPress={handleFilter} />
        <FilterButton label="Ordenar" icon="▼" onPress={handleSort} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.flexWrap}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              style={{ width: cardWidth }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 20,
  },
  flexWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
  },
});
