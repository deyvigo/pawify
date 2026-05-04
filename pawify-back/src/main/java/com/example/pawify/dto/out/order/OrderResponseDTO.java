package com.example.pawify.dto.out.order;

import java.math.BigDecimal;
import java.util.List;

public record OrderResponseDTO(
    Long id,
    BigDecimal totalPrice,
    List<DetailResponseDTO> details
) {}
