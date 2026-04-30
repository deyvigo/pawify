package com.example.pawify.dto.out.user;

import com.example.pawify.dto.out.product.ImageResponseDTO;

public record BuyerResponseSimpleDTO (
    String username,
    String firstName,
    String lastName,
    String dniNumber,
    int countCards,
    int countAddresses,
    ImageResponseDTO image
) {}
