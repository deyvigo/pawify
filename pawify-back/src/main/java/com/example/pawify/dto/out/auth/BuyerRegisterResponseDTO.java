package com.example.pawify.dto.out.auth;

public record BuyerRegisterResponseDTO (
    Long id,
    String username,
    String firstName,
    String lastName,
    String email
) {
}
