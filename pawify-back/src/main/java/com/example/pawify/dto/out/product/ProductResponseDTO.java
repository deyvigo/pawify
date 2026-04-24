package com.example.pawify.dto.out.product;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ProductResponseDTO(
    Long id,
    String name,
    String description,
    BigDecimal price,
    BrandResponseDTO brand,
    CategoryResponseDTO category,
    int soldCount,
    int stock,
    String shareCode,
    boolean active,
    LocalDateTime createdAt,
    List<ImageResponseDTO> images
) {}
