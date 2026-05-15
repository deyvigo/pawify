package com.example.pawify.dto.out.order;

import java.time.LocalDateTime;

public record TrackingStatusResponseDTO(
    Long id,
    String title,
    String description,
    LocalDateTime timestamp
) {}
