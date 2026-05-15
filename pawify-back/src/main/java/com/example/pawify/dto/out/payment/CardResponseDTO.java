package com.example.pawify.dto.out.payment;

import java.time.YearMonth;

public record CardResponseDTO (
    Long id,
    String name,
    String number,
    YearMonth dueDate
) {
}
