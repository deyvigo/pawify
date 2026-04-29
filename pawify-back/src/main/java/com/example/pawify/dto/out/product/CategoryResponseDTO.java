package com.example.pawify.dto.out.product;

import java.util.List;

public record CategoryResponseDTO (
    String name,
    Long id,
    List<SubCategoryResponseDTO> subCategories
) {}
