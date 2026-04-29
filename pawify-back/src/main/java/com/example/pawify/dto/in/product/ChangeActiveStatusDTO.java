package com.example.pawify.dto.in.product;

import jakarta.validation.constraints.NotNull;

public record ChangeActiveStatusDTO (
    @NotNull(message = "Active status must not null")
    boolean active
) {
}
