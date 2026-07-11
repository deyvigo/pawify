import React, { useMemo,useState } from 'react';
import { 
    View, Text, StyleSheet, FlatList, ActivityIndicator, 
    RefreshControl, TouchableOpacity, Image, ScrollView ,TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importamos nuestro Hook y Componentes modulares
import { useOrders } from '../hooks/useOrders';
import { OrderCard } from '../components/Orders/OrderCard';
import { EmptyOrders } from '../components/Orders/EmptyOrders';
import { OrderResponseDTO } from '../types/orders';

interface OrdersScreenProps {
    onNavigateToDetail: (order: OrderResponseDTO) => void;
}

const FILTERS = ['Todos', 'En camino', 'Entregados'];

export const OrdersScreen = ({ onNavigateToDetail }: OrdersScreenProps) => {
    const { 
        orders, isLoading, isRefreshing, isLoadingMore, 
        activeFilter, setActiveFilter, searchQuery, setSearchQuery, 
        handleRefresh, handleLoadMore 
    } = useOrders();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    <Image source={require('../../assets/logopawify.png')} style={styles.headerLogo} />
                    <Text style={styles.headerTitle}>Mis Pedidos</Text>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por número de tracking (#)"
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery} 
                    autoCapitalize="characters" 
                    autoCorrect={false}
                />
            </View>

            <View style={styles.filtersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
                    {FILTERS.map((filter) => (
                        <TouchableOpacity 
                            key={filter} 
                            style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
                            onPress={() => setActiveFilter(filter)}
                        >
                            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* le pasamos "orders" de frente al FlatList */}
            {isLoading ? (
                <ActivityIndicator size="large" color="#FF1A1A" style={{ marginTop: 50 }} />
            ) : orders.length === 0 ? (
                <EmptyOrders />
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <OrderCard order={item} onPressDetail={onNavigateToDetail} />}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={['#FF1A1A']} />}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={isLoadingMore ? <ActivityIndicator style={styles.footerLoader} color="#FF1A1A" /> : null}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFFFFF' },
    headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
    headerLogo: { width: 24, height: 24, tintColor: '#FF1A1A', marginRight: 10 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
    searchContainer: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingBottom: 15 },
    searchInput: { backgroundColor: '#F3F4F6', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10, fontSize: 14, color: '#111827', borderWidth: 1, borderColor: '#E5E7EB' },
    filtersContainer: { backgroundColor: '#FFFFFF', paddingBottom: 15 },
    filtersScroll: { paddingHorizontal: 20, gap: 10 },
    filterPill: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#F3F4F6', borderRadius: 20 },
    filterPillActive: { backgroundColor: '#B91C1C' },
    filterText: { color: '#4B5563', fontWeight: '600', fontSize: 14 },
    filterTextActive: { color: '#FFFFFF' },
    listContainer: { padding: 20, paddingBottom: 100 },
    footerLoader: { marginVertical: 20 }
});