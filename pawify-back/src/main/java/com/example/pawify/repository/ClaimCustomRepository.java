package com.example.pawify.repository;

import com.example.pawify.dto.CursorInternalDTO;
import com.example.pawify.model.ClaimEntity;
import com.example.pawify.model.UserEntity;

import java.time.Instant;
import java.util.List;

public interface ClaimCustomRepository {
    List<ClaimEntity> findClaimsByUserId(
        UserEntity user, int size, CursorInternalDTO cursor
    );
}
