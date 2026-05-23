package com.example.pawify.dto.in.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordRecoveryRequestDTO (
    @NotBlank(message = "username is required")
    String username,
    @NotBlank(message = "code is required")
    String code,
    @NotBlank(message = "new_password is required")
    @Size(min = 8, max = 20, message = "password must be between 8 and 20 characters")
    String newPassword
) {}
