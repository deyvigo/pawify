package com.example.pawify.dto.out.review;

import com.example.pawify.dto.out.buyer.BuyerPreviewResponseDTO;

import java.time.LocalDateTime;

public record ReviewResponseDTO(
    Long id,
    String content,
    int rating,
    LocalDateTime createdAt,
    BuyerPreviewResponseDTO buyer
) {}
