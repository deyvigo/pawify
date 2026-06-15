package com.example.pawify.dto.out.payment;

public record PaymentIntentResponseDTO(
    String clientSecret,
    String ephemeralKey,
    String customerId,
    String paymentIntentId,
    String publishableKey
) {}
