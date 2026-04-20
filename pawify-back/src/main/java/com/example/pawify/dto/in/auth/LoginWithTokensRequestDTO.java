package com.example.pawify.dto.in.auth;

public record LoginWithTokensRequestDTO (
    String token,
    String refreshToken
) {}
