package com.example.pawify.dto.in.payment;

import jakarta.validation.constraints.*;

import java.time.YearMonth;

public record CardCreateRequestDTO (
    @NotBlank(message = "name is required")
    String name,
    @NotBlank(message = "number is required")
    @Pattern(regexp = "\\d{16}", message = "card number must have 16 digits")
    String number,
    @NotNull(message = "due_date is required")
    YearMonth dueDate
) {}
