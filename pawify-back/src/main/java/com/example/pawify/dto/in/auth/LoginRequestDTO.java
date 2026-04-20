package com.example.pawify.dto.in.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequestDTO (
    @NotBlank(message = "username is required")
    @Size(min = 6, max = 20, message = "username must be between 6 and 20 characters")
    String username,
    @NotBlank(message = "password is required")
    @Size(min = 8, max = 20, message = "password must be between 8 and 20 characters")
    String password
) {}
