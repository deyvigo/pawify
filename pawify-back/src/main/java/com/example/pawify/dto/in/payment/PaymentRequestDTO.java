package com.example.pawify.dto.in.payment;

import java.math.BigDecimal;

public record PaymentRequestDTO(
    BigDecimal amount
) {}
