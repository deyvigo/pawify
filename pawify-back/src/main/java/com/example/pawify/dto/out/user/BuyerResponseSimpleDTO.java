package com.example.pawify.dto.out.user;

public record BuyerResponseSimpleDTO (
    String username,
    String firstName,
    String lastName,
    String dniNumber,
    int countCards,
    int countAddresses,
    BuyerImageResponseDTO profile
) {}
