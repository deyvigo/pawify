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
    CategorySimpleDTO category,
    SubCategoryResponseDTO subCategory,
    int soldCount,
    int stock,
    String shareCode,
    boolean active,
    int reviewCount,
    double rating,
    LocalDateTime createdAt,
    List<ImageResponseDTO> images
) {}
