package com.example.pawify.service;

import com.example.pawify.dto.in.order.OrderCreateRequestDTO;
import com.example.pawify.dto.out.order.OrderResponseDTO;
import com.example.pawify.model.BuyerEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public interface OrderService {
    OrderResponseDTO createOrder(BuyerEntity buyerEntity, OrderCreateRequestDTO orderCreateRequestDTO);
    Slice<OrderResponseDTO> getOrdersByBuyer(BuyerEntity buyerEntity, Pageable pageable);
}
