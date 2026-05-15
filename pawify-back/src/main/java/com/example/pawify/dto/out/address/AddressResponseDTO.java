package com.example.pawify.dto.out.address;

public record AddressResponseDTO (
    Long id,
    String name,
    String reference,
    Double latitude,
    Double longitude
) {}
