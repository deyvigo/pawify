import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Alert,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../theme/colors";
import { Header, SearchBar, FilterButton, ProductCard } from "../../components";
import { SortMenu } from "../../components/SortMenu/SortMenu";
import {
  FilterMenu,
  FilterState,
} from "../../components/FilterMenu/FilterMenu";
import { useAppContext } from "../../../App";
import { ProductResponseDTO, Product } from "../../types";
import { Product as ProductType } from "../../types/product";

export type SortOption =
  | "price-asc"
  | "price-desc"
  | "name-az"
  | "name-za"
  | "best-selling"
  | "best-rated";

const GAP = 10;
const HORIZONTAL_PADDING = 16;

const mapProduct = (p: ProductResponseDTO): ProductType => ({
  id: p.share_code || String(p.id),
  name: p.name,
  image: p.images?.[0]?.url || "https://picsum.photos/seed/default/300/300",
  images: p.images?.map(img => img.url) || [],
  price: p.price,
  rating: p.rating,
  sold: p.sold_count,
  description: p.description,
  stock: p.stock,
  share_code: p.share_code,
  active: p.active,
  brand: p.brand?.name,
  category: p.category?.name,
  sub_category: p.sub_category?.name,
});

export const ProductListScreen: React.FC = () => {
  const { 
    openDrawer, 
    setSelectedProduct, 
    products, 
    loading, 
    loadingMore, 
    hasMore, 
    loadProducts, 
    loadMore 
  } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [activeSort, setActiveSort] = useState<SortOption>("name-az");
  const { width } = useWindowDimensions();

  const cardWidth = (width - HORIZONTAL_PADDING * 2 - GAP) / 2;
  const halfRowWidth = (width - HORIZONTAL_PADDING * 2 - GAP) / 2;

  const handleAddToCart = (product: ProductType) => {
    Alert.alert("Agregado", `${product.name} se agregó al carrito`);
  };

  const handleProductPress = (product: ProductType) => {
    setSelectedProduct(product);
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

  // Only trigger loadProducts if searchQuery or activeSort changes AND we are already mounted
  // To avoid fetching again on mount if App.tsx already did it, we check if we actually need to change params
  useEffect(() => {
    if (searchQuery.length > 0 || activeSort !== "name-az") {
      const timeout = setTimeout(() => {
        loadProducts({
          search: searchQuery || undefined,
          sort: activeSort,
        });
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [searchQuery, activeSort]);

  const filteredProducts = useMemo(() => {
    return (products || []).map(mapProduct);
  }, [products]);

  return (
    <View style={styles.container}>
      <Header onActionPress={openDrawer} />
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

      {loading && !loadingMore && products.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
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
                onPress={handleProductPress}
                style={{ width: cardWidth }}
              />
            ))}
          </View>
          {loadingMore && (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingMoreContainer: {
    padding: 20,
    alignItems: 'center',
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
