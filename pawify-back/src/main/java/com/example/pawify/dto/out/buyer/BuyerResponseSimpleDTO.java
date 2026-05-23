package com.example.pawify.dto.out.buyer;

public record BuyerResponseSimpleDTO (
    String username,
    String firstName,
    String lastName,
    String dniNumber,
    int countCards,
    int countAddresses,
    BuyerImageResponseDTO profile
) {}
