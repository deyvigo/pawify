package com.example.pawify.dto.in.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ProductCreateRequestDTO (
    @NotBlank(message = "name is required")
    String name,
    String description,
    @NotBlank(message = "brand is required")
    String brand,
    @NotBlank(message = "category is required")
    String category,
    @NotBlank(message = "sub_category is required")
    String subCategory,
    @NotNull(message = "price is required")
    @DecimalMin(value = "0.00", inclusive = true, message = "price must be a non-negative decimal")
    BigDecimal price,
    @NotNull(message = "stock is required")
    @Min(value = 0, message = "stock must be a non-negative integer")
    int stock
) {}
