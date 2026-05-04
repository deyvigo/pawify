package com.example.pawify.dto.out.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponseDTO(
    Long id,
    BigDecimal totalPrice,
    LocalDateTime orderAt,
    List<DetailResponseDTO> details
) {}
