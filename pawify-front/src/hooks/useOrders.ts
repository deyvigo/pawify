import { useState, useEffect, useCallback } from 'react';
import { OrderResponseDTO } from '../types/orders';
import { getOrdersByBuyer } from '../services/orderService';

export const useOrders = () => {
    const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    
    // Estados de carga
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    
    // Estado para los filtros superiores
    const [activeFilter, setActiveFilter] = useState<string>('Todos');

    const fetchOrders = async (pageNumber: number, shouldRefresh: boolean = false) => {
        try {
            const response = await getOrdersByBuyer(pageNumber, 10, 'orderAt,desc');
            
            if (shouldRefresh) {
                setOrders(response.content);
            } else {
                setOrders(prev => [...prev, ...response.content]);
            }
            
            setHasMore(!response.last);
            setPage(response.number);
        } catch (error) {
            console.error("Error obteniendo pedidos:", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchOrders(0, true);
    }, []);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchOrders(0, true);
    }, []);

    const handleLoadMore = useCallback(() => {
        if (hasMore && !isLoadingMore && !isLoading) {
            setIsLoadingMore(true);
            fetchOrders(page + 1, false);
        }
    }, [hasMore, isLoadingMore, isLoading, page]);

    return {
        orders,
        isLoading,
        isRefreshing,
        isLoadingMore,
        activeFilter,
        setActiveFilter,
        handleRefresh,
        handleLoadMore
    };
};



