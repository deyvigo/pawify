package com.example.pawify.dto.out.order;

import com.example.pawify.dto.out.buyer.BuyerPreviewResponseDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponseDTO(
    Long id,
    BigDecimal totalPrice,
    LocalDateTime orderAt,
    String trackingCode,
    String shippingStatus,
    String orderStatus,
    BuyerPreviewResponseDTO buyer,
    List<DetailResponseDTO> details
) {}
