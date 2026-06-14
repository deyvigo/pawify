package com.example.pawify.dto.out.claim;

import com.example.pawify.dto.out.admin.AdminResponseSimpleDTO;
import com.example.pawify.dto.out.buyer.BuyerPreviewResponseDTO;
import com.example.pawify.dto.out.order.DetailResponseDTO;

import java.time.Instant;

public record ClaimResponseDTO(
    Long id,
    String lastMessage,
    Instant lastModified,
    String lastMessageSender,
    AdminResponseSimpleDTO admin,
    BuyerPreviewResponseDTO buyer,
    DetailResponseDTO detail
) {}
