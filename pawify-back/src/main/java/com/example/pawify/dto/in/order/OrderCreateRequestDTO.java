package com.example.pawify.dto.in.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record OrderCreateRequestDTO (
    @NotNull(message = "details ir required")
    @NotEmpty(message = "details must contain at least one item")
    List<@Valid DetailCreateRequestDTO> details
) {}
