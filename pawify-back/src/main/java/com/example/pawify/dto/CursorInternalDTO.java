package com.example.pawify.dto;

import java.time.Instant;

public record CursorInternalDTO(
    Instant instant,
    Long id
) {}
