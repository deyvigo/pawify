package com.example.pawify.dto.out.user;

public record UpdateBuyerResponseDTO (
    String lastName,
    String firstName,
    String email,
    String dniNumber
) {}
