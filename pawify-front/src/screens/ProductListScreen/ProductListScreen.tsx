import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Alert,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Text,
} from "react-native";
import { colors } from "../../theme/colors";
import { Header, SearchBar, FilterButton, ProductCard } from "../../components";
import { SortMenu } from "../../components/SortMenu/SortMenu";
import {
  FilterMenu,
  FilterState,
} from "../../components/FilterMenu/FilterMenu";
import { useAppContext } from "../../../App";
import { useProducts } from "../../hooks/useProducts";
import { ProductResponseDTO } from "../../types";

type SortOption =
  | "price-asc"
  | "price-desc"
  | "name-az"
  | "name-za"
  | "best-selling"
  | "best-rated";

const GAP = 10;
const HORIZONTAL_PADDING = 16;

const mapProduct = (p: ProductResponseDTO) => ({
  id: p.share_code || String(p.id),
  name: p.name,
  image: p.images?.[0]?.url || "https://picsum.photos/seed/default/300/300",
  price: p.price,
  rating: p.rating,
  sold: p.sold_count,
  brand: p.brand?.name,
  category: p.category?.name,
});

export const ProductListScreen: React.FC = () => {
  const { openDrawer } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [activeSort, setActiveSort] = useState<SortOption>("name-az");
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);
  const { width } = useWindowDimensions();

  const { products: rawProducts, loading, loadingMore, error, hasMore, loadProducts, loadMore } = useProducts();
  const products = Array.isArray(rawProducts) ? rawProducts : [];

  const cardWidth = (width - HORIZONTAL_PADDING * 2 - GAP) / 2;
  const halfRowWidth = (width - HORIZONTAL_PADDING * 2 - GAP) / 2;

  const handleAddToCart = (product: ReturnType<typeof mapProduct>) => {
    Alert.alert("Agregado", `${product.name} se agregó al carrito`);
  };

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      if (hasMore && !loadingMore) {
        loadMore();
      }
    }
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
    loadProducts({ sort, search: searchQuery || undefined });
  };

  const handleFilterApply = (filters: FilterState) => {
    setActiveFilters(filters);
    setShowFilter(false);
    loadProducts({
      sort: activeSort,
      search: searchQuery || undefined,
      minPrice: filters.priceMin,
      maxPrice: filters.priceMax,
      brand: filters.brands.length === 1 ? filters.brands[0] : undefined,
      category: filters.categories.length === 1 ? filters.categories[0] : undefined,
    });
  };

  useEffect(() => {
    if (searchQuery.length === 0 || searchQuery.length > 2) {
      const timeout = setTimeout(() => {
        loadProducts({
          search: searchQuery || undefined,
          sort: activeSort,
        });
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [searchQuery, activeSort, loadProducts]);

  const safeProducts = Array.isArray(products) ? products : [];
  const filteredProducts = useMemo(() => {
    return safeProducts.map(mapProduct);
  }, [safeProducts]);

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
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
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
        {loadingMore && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}
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
