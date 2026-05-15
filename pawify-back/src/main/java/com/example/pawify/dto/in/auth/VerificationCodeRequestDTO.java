package com.example.pawify.dto.in.auth;

import jakarta.validation.constraints.NotBlank;

public record VerificationCodeRequestDTO(
    @NotBlank(message = "username is requiered")
    String username,
    @NotBlank(message = "code is requiered")
    String code
) {}
