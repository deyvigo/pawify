package com.example.pawify.dto.in.claim;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MessageRequestDTO(
    @NotNull(message = "claim_id is required")
    Long claimId,
    @NotBlank(message = "content is required")
    String content
) {}
