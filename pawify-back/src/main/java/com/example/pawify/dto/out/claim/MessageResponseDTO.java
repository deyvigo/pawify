package com.example.pawify.dto.out.claim;

import com.example.pawify.dto.out.buyer.BuyerPreviewResponseDTO;
import com.example.pawify.dto.out.order.DetailResponseDTO;

import java.time.Instant;

public record MessageResponseDTO(
    Long claimId,
    Long id,
    String content,
    Instant sendAt,
    UserResponseDTO sender,
    BuyerPreviewResponseDTO buyer,
    DetailResponseDTO detail
) {}
