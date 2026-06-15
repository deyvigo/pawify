import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../theme/colors";
import { Header, SearchBar, FilterButton, ProductCard } from "../../components";
import { SortMenu } from "../../components/SortMenu/SortMenu";
import {  FilterMenu,  FilterState,} from "../../components/FilterMenu/FilterMenu";
import { useAppContext } from '../../context/AppContext';
import { ProductResponseDTO, Product } from "../../types";
import { Product as ProductType } from "../../types/product";
import { FilterIcon } from "../../components/icons/FilterIcon";
import { SortIcon } from "../../components/icons/SortIcon";

export type SortOption =
  | "price-asc"
  | "price-desc"
  | "name-az"
  | "name-za"
  | "best-selling"
  | "best-rated";

const GAP = 10;
const HORIZONTAL_PADDING = 16;

const sortImages = (images: { id: number; url: string }[]) =>
  [...images].sort((a, b) => a.id - b.id);

const mapProduct = (p: ProductResponseDTO): ProductType => {
  const sortedImages = sortImages(p.images || []);
  return {
    productId: p.id,
    name: p.name,
    image: sortedImages[0]?.url || "https://picsum.photos/seed/default/300/300",
    images: sortedImages.map(img => img.url),
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
  };
};

export const ProductListScreen: React.FC = () => {
  const { 
    openDrawer, 
    setSelectedProduct, 
    products, 
    loading, 
    loadingMore, 
    hasMore, 
    loadProducts, 
    loadMore,
    currentUser,
    refresh,
    pendingFilterParams,
    setPendingFilterParams,
    addToCart,
  } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [activeSort, setActiveSort] = useState<SortOption>("name-az");
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const { width } = useWindowDimensions();
  const prevUserRef = React.useRef(currentUser);

  // Reload products when user logs in
  useEffect(() => {
    if (currentUser && !prevUserRef.current) {
      refresh();
    }
    prevUserRef.current = currentUser;
  }, [currentUser]);

  // Apply navigation-driven filters from DrawerMenu
  useEffect(() => {
    if (!pendingFilterParams) return;
    const params: Record<string, any> = { sort: activeSort, search: searchQuery || undefined };
    if (pendingFilterParams.category) params.category = pendingFilterParams.category;
    if (pendingFilterParams.subCategory) params.subCategory = pendingFilterParams.subCategory;
    if (pendingFilterParams.brand) params.brand = pendingFilterParams.brand;
    setAppliedFilters(params);
    loadProducts(params);
    setPendingFilterParams(null);
  }, [pendingFilterParams]);

  const cardWidth = (width - HORIZONTAL_PADDING * 2 - GAP) / 2;
  const halfRowWidth = (width - HORIZONTAL_PADDING * 2 - GAP) / 2;

  const handleAddToCart = (product: ProductType) => {
    addToCart(product);
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
    loadProducts({ ...appliedFilters, sort, search: searchQuery || undefined, page: 0 });
  };

  const handleFilterApply = (filters: FilterState) => {
    setShowFilter(false);
    const params: Record<string, any> = {
      sort: activeSort,
      search: searchQuery || undefined,
      minPrice: filters.priceMin,
      maxPrice: filters.priceMax,
      brand: filters.brands.length === 1 ? filters.brands[0] : undefined,
      category: filters.categories.length === 1 ? filters.categories[0] : undefined,
      subCategory: filters.subCategories.length === 1 ? filters.subCategories[0] : undefined,
    };
    setAppliedFilters(params);
    loadProducts(params);
  };

  // Only trigger loadProducts if searchQuery or activeSort changes AND we are already mounted
  // To avoid fetching again on mount if App.tsx already did it, we check if we actually need to change params
  useEffect(() => {
    if (searchQuery.length > 0 || activeSort !== "name-az") {
      const timeout = setTimeout(() => {
        loadProducts({
          ...appliedFilters,
          search: searchQuery || undefined,
          sort: activeSort,
          page: 0,
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
        <FilterButton label="Filtro" icon={<FilterIcon size={16} />} onPress={handleFilter} />
        <FilterButton label="Ordenar" icon={<SortIcon size={16} />} onPress={handleSort} />
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
          <TouchableWithoutFeedback onPress={() => setShowSort(false)}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <View style={styles.sortRow}>
            <View style={[styles.sortSpacer, { width: halfRowWidth }]} />
            <View style={[styles.sortMenuWrapper, { width: halfRowWidth }]}>
              <SortMenu activeSort={activeSort} onSortSelect={handleSortSelect} />
            </View>
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
                key={product.productId}
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    paddingTop: 150,
  },
  sortRow: {
    flexDirection: "row",
    gap: GAP,
    paddingHorizontal: HORIZONTAL_PADDING,
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
