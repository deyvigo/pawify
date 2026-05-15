package com.example.pawify.dto.in.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ReviewCreateRequestDTO(
    @NotBlank(message = "content is required")
    String content,
    @NotNull(message = "rating is required")
    @Min(value = 1, message = "rating must be at least 1")
    @Max(value = 5, message = "rating must be at most 5")
    Integer rating,
    @NotNull(message = "detail_id is required")
    Long detailId
) {}
