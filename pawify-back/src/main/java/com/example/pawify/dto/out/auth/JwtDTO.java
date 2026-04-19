package com.example.pawify.dto.out.auth;

public record JwtDTO (
    String token,
    String refreshToken
) {}
