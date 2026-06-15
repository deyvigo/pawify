package com.example.pawify.dto.out.buyer;

public record BuyerResponseSimpleDTO (
    Long id,
    String username,
    String firstName,
    String lastName,
    String dniNumber,
    String email,
    int countCards,
    int countAddresses,
    BuyerPreviewResponseDTO profile
) {}
