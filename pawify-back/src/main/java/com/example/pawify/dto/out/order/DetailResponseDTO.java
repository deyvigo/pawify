package com.example.pawify.dto.out.order;

import com.example.pawify.dto.out.product.ProductImageResponseDTO;

import java.math.BigDecimal;

public record DetailResponseDTO(
    Long id,
    String productName,
    int quantity,
    BigDecimal price,
    int total,
    String productImage
) {}
