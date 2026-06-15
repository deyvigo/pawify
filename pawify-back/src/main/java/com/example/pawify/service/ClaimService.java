package com.example.pawify.service;

import com.example.pawify.dto.in.claim.ClaimCreateRequestDTO;
import com.example.pawify.dto.out.Page;
import com.example.pawify.dto.out.claim.ClaimResponseDTO;
import com.example.pawify.model.BuyerEntity;
import com.example.pawify.model.UserEntity;

public interface ClaimService {
    ClaimResponseDTO createClaim(BuyerEntity buyer, ClaimCreateRequestDTO claimRequest);
    Page<ClaimResponseDTO> getClaims(UserEntity user, int size, String cursorEncoded);
}
