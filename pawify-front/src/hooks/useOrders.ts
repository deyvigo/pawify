import { useState, useEffect, useCallback } from 'react';
import { OrderResponseDTO } from '../types/orders';
import { getOrdersByBuyer } from '../services/orderService';

// Maneja el listado paginado de ordenes del comprador con filtros y refresh
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
            const response = await getOrdersByBuyer(pageNumber, 10);
            
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



// import { useState, useEffect, useCallback } from 'react';
// import { OrderResponseDTO } from '../types/orders';

// // 👇 1. CREAMOS NUESTROS DATOS FALSOS (Basados en tu diseño) 👇
// const MOCK_ORDERS: OrderResponseDTO[] = [
//     {
//         id: 1,
//         trackingCode: 'ORD-7721',
//         orderAt: '2023-10-12T10:00:00',
//         totalPrice: 45.50,
//         shippingStatus: 'PROCESSING',
//         details: [
//             { id: 1, productName: 'Collar de Cuero Premium - Rojo', quantity: 1, price: 24.99, total: 24.99, productImage: 'https://images.unsplash.com/photo-1605027621643-43180b95764d?q=80&w=200&auto=format&fit=crop' },
//             { id: 2, productName: 'Snacks Orgánicos Sin Granos', quantity: 2, price: 10.25, total: 20.51, productImage: 'https://images.unsplash.com/photo-1582798358481-d199fb7347bb?q=80&w=200&auto=format&fit=crop' }
//         ]
//     },
//     {
//         id: 2,
//         trackingCode: 'ORD-7690',
//         orderAt: '2023-10-08T14:15:00',
//         totalPrice: 120.00,
//         shippingStatus: 'SHIPPED',
//         details: [
//             { id: 3, productName: 'Cama Ortopédica para Perros', quantity: 1, price: 120.00, total: 120.00, productImage: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?q=80&w=200&auto=format&fit=crop' }
//         ]
//     },
//     {
//         id: 3,
//         trackingCode: 'ORD-7502',
//         orderAt: '2023-09-25T09:30:00',
//         totalPrice: 28.90,
//         shippingStatus: 'DELIVERED',
//         details: [
//             { id: 4, productName: 'Juguete Mordedor Resistente', quantity: 3, price: 9.63, total: 28.90, productImage: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=200&auto=format&fit=crop' }
//         ]
//     }
// ];

// export const useOrders = () => {
//     // 👇 2. INICIALIZAMOS EL ESTADO CON LOS DATOS FALSOS EN LUGAR DE UN ARREGLO VACÍO 👇
//     const [orders, setOrders] = useState<OrderResponseDTO[]>(MOCK_ORDERS);
    
//     const [page, setPage] = useState<number>(0);
//     const [hasMore, setHasMore] = useState<boolean>(false); // Lo ponemos en falso para que no intente cargar más por ahora
    
//     // Apagamos la carga inicial para que muestre los datos de inmediato
//     const [isLoading, setIsLoading] = useState<boolean>(false); 
//     const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
//     const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    
//     const [activeFilter, setActiveFilter] = useState<string>('Todos');

//     // 👇 3. COMENTAMOS O SIMULAMOS LA FUNCIÓN REAL 👇
//     const fetchOrders = async (pageNumber: number, shouldRefresh: boolean = false) => {
//         /* TEMPORALMENTE COMENTADO HASTA QUE EL CHECKOUT FUNCIONE:
//         try {
//             const response = await getOrdersByBuyer(pageNumber, 10);
//             if (shouldRefresh) {
//                 setOrders(response.content);
//             } else {
//                 setOrders(prev => [...prev, ...response.content]);
//             }
//             setHasMore(!response.last);
//             setPage(response.number);
//         } catch (error) {
//             console.error("Error obteniendo pedidos:", error);
//         } finally {
//             setIsLoading(false);
//             setIsRefreshing(false);
//             setIsLoadingMore(false);
//         }
//         */

//         // Simulamos un pequeño retraso visual para el refresh
//         setTimeout(() => {
//             setIsRefreshing(false);
//         }, 1000);
//     };

//     useEffect(() => {
//         // fetchOrders(0, true); // Ya tenemos los datos iniciales, no necesitamos llamarlo
//     }, []);

//     const handleRefresh = useCallback(() => {
//         setIsRefreshing(true);
//         fetchOrders(0, true);
//     }, []);

//     const handleLoadMore = useCallback(() => {
//         // Deshabilitado en modo mock
//     }, []);

//     return {
//         orders,
//         isLoading,
//         isRefreshing,
//         isLoadingMore,
//         activeFilter,
//         setActiveFilter,
//         handleRefresh,
//         handleLoadMore
//     };
// };