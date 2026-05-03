package com.example.pawify.dto.in.buyer;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateBuyerRequestDTO (
    @NotBlank(message = "first_name is required")
    String firstName,
    @NotBlank(message = "last_name is required")
    String lastName,
    @NotBlank(message = "email is required")
    @Email
    @Size(max = 100)
    String email,
    @NotBlank(message = "dni_number is required")
    @Size(min = 8, max = 8)
    @Pattern(regexp = "\\d{8}")
    String dniNumber
) {}
