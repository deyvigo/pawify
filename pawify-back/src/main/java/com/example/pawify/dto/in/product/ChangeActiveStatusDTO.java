package com.example.pawify.dto.in.product;

import jakarta.validation.constraints.NotBlank;

public record ChangeActiveStatusDTO (
    @NotBlank(message = "Active status must not be blank")
    boolean active
) {
}
