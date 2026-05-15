package com.example.pawify.dto.in.address;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AddressCreateRequestDTO (
    @NotBlank(message = "name is required")
    String name,
    @NotBlank(message = "reference is required")
    String reference,
    @NotNull(message = "latitude is required")
    Double latitude,
    @NotNull(message = "longitude is required")
    Double longitude
) {}
