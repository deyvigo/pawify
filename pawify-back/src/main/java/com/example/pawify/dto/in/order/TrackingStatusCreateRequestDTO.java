package com.example.pawify.dto.in.order;

public record TrackingStatusCreateRequestDTO(
    Long orderId,
    String title,
    String description
) {}
