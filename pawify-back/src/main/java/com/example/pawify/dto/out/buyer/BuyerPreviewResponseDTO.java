package com.example.pawify.dto.out.buyer;

public record BuyerPreviewResponseDTO(
    Long id,
    String username,
    String firstName,
    String lastName,
    BuyerImageResponseDTO profile
) {
}
