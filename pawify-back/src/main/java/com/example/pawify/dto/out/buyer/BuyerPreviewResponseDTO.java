package com.example.pawify.dto.out.buyer;

public record BuyerPreviewResponseDTO(
    String username,
    String firstName,
    String lastName,
    BuyerImageResponseDTO profile
) {
}
