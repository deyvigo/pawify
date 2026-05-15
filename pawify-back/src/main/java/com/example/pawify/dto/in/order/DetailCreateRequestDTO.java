package com.example.pawify.dto.in.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record DetailCreateRequestDTO (
    @NotNull(message = "product id is required")
    Long productId,
    @NotNull(message = "quantity is required")
    @Min(value = 1, message = "quantity must be greater than 0")
    Integer quantity
) {}
