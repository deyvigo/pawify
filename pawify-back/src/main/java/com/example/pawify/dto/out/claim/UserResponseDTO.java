package com.example.pawify.dto.out.claim;

public record UserResponseDTO(
    Long id,
    String username,
    String firstName,
    String lastName
) {}
