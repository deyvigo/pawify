package com.example.pawify.service;

import com.example.pawify.dto.out.Page;
import com.example.pawify.dto.out.claim.MessageResponseDTO;
import com.example.pawify.model.UserEntity;

public interface MessageService {
    Page<MessageResponseDTO> getMessageByClaim(UserEntity user, Long claimId, String cursor, int size);
}
