package com.example.pawify.service;

import com.example.pawify.dto.in.order.OrderCreateRequestDTO;
import com.example.pawify.dto.out.Page;
import com.example.pawify.dto.out.order.OrderResponseDTO;
import com.example.pawify.model.BuyerEntity;
import com.example.pawify.model.OrderStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public interface OrderService {
    OrderResponseDTO createOrder(BuyerEntity buyerEntity, OrderCreateRequestDTO orderCreateRequestDTO);
//    Slice<OrderResponseDTO> getOrdersByBuyer(BuyerEntity buyerEntity, Pageable pageable);
    OrderResponseDTO getOrderByTrackingCode(String trackingCode);
    void updateOrderStatusByOrderId(Long orderId, OrderStatus orderStatus);
    Page<OrderResponseDTO> getOrdersWithFilters(
        String cursor, BuyerEntity buyer, Integer size, String shippingStatus, String trackingCode
    );
}
