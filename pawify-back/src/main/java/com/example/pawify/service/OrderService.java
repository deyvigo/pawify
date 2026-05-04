package com.example.pawify.service;

import com.example.pawify.dto.in.order.OrderCreateRequestDTO;
import com.example.pawify.dto.out.order.OrderResponseDTO;
import com.example.pawify.model.BuyerEntity;

public interface OrderService {
    OrderResponseDTO createOrder(BuyerEntity buyerEntity, OrderCreateRequestDTO orderCreateRequestDTO);
}
