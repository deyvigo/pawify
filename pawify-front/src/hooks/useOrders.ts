import { useState, useEffect, useCallback } from 'react';
import { OrderResponseDTO } from '../types/orders';
import { getFilteredOrders } from '../services/orderService';

export const useOrders = () => {
    const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [hasMore, setHasMore] = useState<boolean>(true);
    
    // Estados de carga
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    
    // Estado para los filtros superiores
    const [activeFilter, setActiveFilter] = useState<string>('Todos');
    const [searchQuery, setSearchQuery] = useState<string>('');


    const getBackendShippingStatus = (filter: string) => {
        if (filter === 'En camino') return 'IN_TRANSIT';
        if (filter === 'Entregados') return 'DELIVERED';
        return undefined; // 'Todos'
    };

    const fetchOrders = async (
        currentCursor?: string, 
        shouldRefresh: boolean = false,
        currentFilter: string = activeFilter,
        currentSearch: string = searchQuery
    ) => {
        try {
            const shippingStatus = getBackendShippingStatus(currentFilter);
            const tracking = currentSearch.trim() !== '' ? currentSearch : undefined;

            const response = await getFilteredOrders(currentCursor, 10, shippingStatus, tracking);

            const newOrders = response.content || [];
            
            if (shouldRefresh) {
                setOrders(newOrders);
            } else {
                setOrders(prev => {
                    const filtered = newOrders.filter(
                        newOrder => !prev.some(existing => existing.id === newOrder.id)
                    );
                    return [...prev, ...filtered];
                });
            }

            if (newOrders.length < 10 || response.last === true) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
            
            if (shouldRefresh) {
                
                setCursor("1");
            } else {
                
                setCursor(prev => prev ? String(Number(prev) + 1) : "1");
            }
        } catch (error) {
            console.error("Error obteniendo pedidos:", error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        
        // Espera 500ms después de que el usuario deje de escribir para llamar al backend
        const delayDebounceFn = setTimeout(() => {
            fetchOrders(undefined, true, activeFilter, searchQuery);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [activeFilter, searchQuery]);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchOrders(undefined, true);
    }, [activeFilter, searchQuery]);

    const handleLoadMore = useCallback(() => {
        if (hasMore && !isLoadingMore && !isLoading) {
            setIsLoadingMore(true);
            fetchOrders(cursor, false);
        }
    }, [hasMore, isLoadingMore, isLoading, cursor, activeFilter, searchQuery]);

    return {
        orders,
        isLoading,
        isRefreshing,
        isLoadingMore,
        activeFilter,
        setActiveFilter,
        searchQuery,
        setSearchQuery,
        handleRefresh,
        handleLoadMore
    };
};

