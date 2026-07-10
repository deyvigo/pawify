package com.example.pawify.dto.out.admin;

import java.math.BigDecimal;
import java.time.Instant;

public record OrderSimpleResponseDTO(
    Long id,
    BigDecimal totalPrice,
    Instant orderAt,
    String trackingCode,
    String shippingStatus,
    String orderStatus
) {}
