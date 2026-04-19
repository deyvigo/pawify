package com.example.pawify.dto.out.auth;

public record AdminRegisterResponseDTO (
    Long id,
    String username,
    String firstName,
    String lastName,
    String dniNumber
) {}
