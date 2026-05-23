package com.example.pawify.dto.out.buyer;

public record UpdateBuyerResponseDTO (
    String lastName,
    String firstName,
    String email,
    String dniNumber
) {}
