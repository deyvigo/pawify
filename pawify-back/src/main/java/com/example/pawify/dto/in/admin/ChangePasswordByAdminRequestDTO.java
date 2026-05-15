package com.example.pawify.dto.in.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordByAdminRequestDTO(
    @NotBlank(message = "new password is required")
    @Size(min = 8, max = 20, message = "password must be between 8 and 20 characters")
    String newPassword
) {}
