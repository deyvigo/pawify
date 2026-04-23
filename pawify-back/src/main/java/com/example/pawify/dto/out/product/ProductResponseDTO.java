package com.example.pawify.dto.out.product;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ProductResponseDTO(
    Long id,
    String name,
    String description,
    BigDecimal price,
    int stock,
    String shareCode,
    LocalDateTime createdAt,
    List<ImageResponseDTO> images
) {}
