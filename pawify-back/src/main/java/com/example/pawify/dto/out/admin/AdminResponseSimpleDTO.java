package com.example.pawify.dto.out.admin;

import java.time.LocalDateTime;

public record AdminResponseSimpleDTO (
    Long id,
    String username,
    String firstName,
    String lastName,
    String dniNumber,
    LocalDateTime createdAt
) {}
