package com.example.pawify.repository;

import com.example.pawify.dto.CursorInternalDTO;
import com.example.pawify.model.MessageEntity;

import java.util.List;

public interface MessageRepositoryCustom {
    List<MessageEntity> findMessagesByClaimId(Long claimId, int size, CursorInternalDTO cursor);
}
