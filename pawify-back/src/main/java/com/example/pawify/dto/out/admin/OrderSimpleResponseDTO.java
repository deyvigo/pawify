package com.example.pawify.dto.out.admin;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrderSimpleResponseDTO(
    Long id,
    BigDecimal totalPrice,
    LocalDateTime orderAt,
    String trackingCode,
    String shippingStatus
) {}
