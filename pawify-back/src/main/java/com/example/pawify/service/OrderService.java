package com.example.pawify.service;

import com.example.pawify.dto.in.order.OrderCreateRequestDTO;
import com.example.pawify.dto.out.order.OrderResponseDTO;
import com.example.pawify.model.BuyerEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

// Servicio de gestion de ordenes de compra
public interface OrderService {

    // Crea una orden validando stock, descontando y generando tracking code
    OrderResponseDTO createOrder(BuyerEntity buyerEntity, OrderCreateRequestDTO orderCreateRequestDTO);

    // Lista ordenes de un comprador con paginacion
    Slice<OrderResponseDTO> getOrdersByBuyer(BuyerEntity buyerEntity, Pageable pageable);

    // Busca una orden por su tracking code
    OrderResponseDTO getOrderByTrackingCode(String trackingCode);
}
