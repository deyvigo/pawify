import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { colors } from "../../theme/colors";
import { Header, SearchBar, FilterButton, ProductCard } from "../../components";
import { SortMenu } from "../../components/SortMenu/SortMenu";
import {
  FilterMenu,
  FilterState,
} from "../../components/FilterMenu/FilterMenu";
import { useAppContext } from "../../../App";

type SortOption =
  | "price-asc"
  | "price-desc"
  | "name-az"
  | "name-za"
  | "best-selling"
  | "best-rated";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  sold: number;
  brand?: string;
  category?: string;
  pet?: string;
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
    brand: "Royal Canin",
    category: "Alimento",
    pet: "Perro",
  },
  {
    id: "2",
    name: "Juguete Hueso de Goma",
    image:
      "https://i0.wp.com/cat-oh.com/wp-content/uploads/2022/02/7070_arnes_para_gato_5.webp?resize=317%2C317&ssl=1",
    price: 12.5,
    rating: 4,
    sold: 189,
    brand: "Purina",
    category: "Juguetes",
    pet: "Perro",
  },
  {
    id: "3",
    name: "Cama Acolchada para Gato",
    image: "https://picsum.photos/seed/cama/300/300",
    price: 67.0,
    rating: 5,
    sold: 312,
    brand: "Hill's",
    category: "Camas",
    pet: "Gato",
  },
  {
    id: "4",
    name: "Collar Antipulgas",
    image: "https://picsum.photos/seed/collar/300/300",
    price: 22.99,
    rating: 3,
    sold: 156,
    brand: "Eukanuba",
    category: "Salud",
    pet: "Perro",
  },
  {
    id: "5",
    name: "Snacks Naturales para Perro",
    image: "https://picsum.photos/seed/snacks/300/300",
    price: 8.99,
    rating: 4,
    sold: 421,
    brand: "Pedigree",
    category: "Alimento",
    pet: "Perro",
  },
  {
    id: "6",
    name: "Arena Aglomerante para Gato",
    image: "https://picsum.photos/seed/arena/300/300",
    price: 15.5,
    rating: 4,
    sold: 278,
    brand: "Whiskas",
    category: "Higiene",
    pet: "Gato",
  },
];

const GAP = 10;
const HORIZONTAL_PADDING = 16;

export const ProductListScreen: React.FC = () => {
  const { openDrawer } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [activeSort, setActiveSort] = useState<SortOption>("name-az");
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);
  const { width } = useWindowDimensions();

  const cardWidth = (width - HORIZONTAL_PADDING * 2 - GAP) / 2;
  const halfRowWidth = (width - HORIZONTAL_PADDING * 2 - GAP) / 2;

  const handleAddToCart = (product: Product) => {
    Alert.alert("Agregado", `${product.name} se agregó al carrito`);
  };

  const handleFilter = () => {
    setShowFilter((prev) => !prev);
    setShowSort(false);
  };

  const handleSort = () => {
    setShowSort((prev) => !prev);
    setShowFilter(false);
  };

  const handleSortSelect = (sort: SortOption) => {
    setActiveSort(sort);
    setShowSort(false);
  };

  const handleFilterApply = (filters: FilterState) => {
    setActiveFilters(filters);
    setShowFilter(false);
  };

  const applyFilters = (products: Product[]): Product[] => {
    if (!activeFilters) return products;

    let result = [...products];

    if (activeFilters.priceMin > 0 || activeFilters.priceMax < 100) {
      result = result.filter(
        (p) =>
          p.price >= activeFilters.priceMin &&
          p.price <= activeFilters.priceMax,
      );
    }

    if (activeFilters.brands.length > 0) {
      result = result.filter(
        (p) => p.brand && activeFilters.brands.includes(p.brand),
      );
    }

    if (activeFilters.categories.length > 0) {
      result = result.filter(
        (p) => p.category && activeFilters.categories.includes(p.category),
      );
    }

    if (activeFilters.pets.length > 0) {
      result = result.filter(
        (p) => p.pet && activeFilters.pets.includes(p.pet),
      );
    }

    return result;
  };

  const filteredProducts = useMemo(() => {
    let products = mockProducts.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    products = applyFilters(products);

    switch (activeSort) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "name-az":
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-za":
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "best-selling":
        products.sort((a, b) => b.sold - a.sold);
        break;
      case "best-rated":
        products.sort((a, b) => b.rating - a.rating);
        break;
    }

    return products;
  }, [searchQuery, activeSort, activeFilters]);

  return (
    <View style={styles.container}>
      <Header onMenuPress={openDrawer} />
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <View style={styles.filterRow}>
        <FilterButton label="Filtro" icon="ᯤ" onPress={handleFilter} />
        <FilterButton label="Ordenar" icon="▼" onPress={handleSort} />
      </View>
      {showFilter && (
        <View style={styles.filterOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowFilter(false)}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <View style={styles.filterMenuWrapper}>
            <FilterMenu onApply={handleFilterApply} />
          </View>
        </View>
      )}
      {showSort && (
        <View style={styles.sortOverlay}>
          <View style={[styles.sortSpacer, { width: halfRowWidth }]} />
          <View style={[styles.sortMenuWrapper, { width: halfRowWidth }]}>
            <SortMenu activeSort={activeSort} onSortSelect={handleSortSelect} />
          </View>
        </View>
      )}
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
    gap: GAP,
    paddingHorizontal: HORIZONTAL_PADDING,
    marginBottom: 12,
  },
  filterOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    paddingTop: 150,
  },
  filterMenuWrapper: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  sortOverlay: {
    position: "absolute",
    top: 150,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: GAP,
    paddingHorizontal: HORIZONTAL_PADDING,
    zIndex: 10,
  },
  sortSpacer: {},
  sortMenuWrapper: {},
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
