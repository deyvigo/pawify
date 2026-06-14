package com.example.pawify.dto.out.order;

import java.time.Instant;

public record TrackingStatusResponseDTO(
    Long id,
    String title,
    String description,
    Instant timestamp
) {}
