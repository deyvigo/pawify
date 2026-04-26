package com.example.pawify.dto.in.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record BuyerRegisterRequestDTO(
    @NotBlank(message = "username is required")
    @Size(min = 6, max = 20, message = "username must be between 6 and 20 characters")
    String username,
    @NotBlank(message = "password is required")
    @Size(min = 8, max = 20, message = "password must be between 8 and 20 characters")
    String password,
    @NotBlank(message = "first_name is required")
    String firstName,
    @NotBlank(message = "last_name is required")
    String lastName,
    @NotBlank(message = "email ir required")
    @Email
    @Size(max = 100)
    String email,
    @NotBlank(message = "dni_number is required")
    @Size(min = 8, max = 8)
    @Pattern(regexp = "\\d{8}")
    String dniNumber
) {}
