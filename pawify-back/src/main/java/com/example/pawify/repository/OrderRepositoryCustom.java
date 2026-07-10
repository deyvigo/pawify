package com.example.pawify.repository;

import com.example.pawify.dto.CursorInternalDTO;
import com.example.pawify.model.BuyerEntity;
import com.example.pawify.model.OrderEntity;

import java.util.List;

public interface OrderRepositoryCustom {
    List<OrderEntity> findAllWithFilters(
        CursorInternalDTO cursor, BuyerEntity buyer, Integer size, String status, String trackingCode
    );
}
