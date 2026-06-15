package com.example.pawify.controller;

import com.example.pawify.dto.in.claim.ClaimCreateRequestDTO;
import com.example.pawify.dto.out.Page;
import com.example.pawify.dto.out.claim.ClaimResponseDTO;
import com.example.pawify.model.BuyerEntity;
import com.example.pawify.model.UserEntity;
import com.example.pawify.service.ClaimService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/claim")
@AllArgsConstructor
public class ClaimController {
    private final ClaimService claimService;

    @PostMapping("")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<ClaimResponseDTO> createClaim(
        @AuthenticationPrincipal BuyerEntity buyerEntity,
        @RequestBody ClaimCreateRequestDTO claimCreateRequestDTO
    ) {
        return ResponseEntity.ok(claimService.createClaim(buyerEntity, claimCreateRequestDTO));
    }

    @GetMapping("/mine")
    public ResponseEntity<Page<ClaimResponseDTO>> getAllByUser(
        @AuthenticationPrincipal UserEntity user,
        @RequestParam(required = false) Integer size,
        @RequestParam(required = false) String cursor
    ) {
        return ResponseEntity.ok(claimService.getClaims(user, size != null ? size : 15, cursor));
    }
}
