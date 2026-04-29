package com.example.pawify.dto.in.auth;

import jakarta.validation.constraints.NotBlank;

public record RecoveryCodeRequestDTO(
    @NotBlank(message = "username is required")
    String username
) {}
