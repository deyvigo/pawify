package com.example.pawify.controller;

import com.example.pawify.dto.in.payment.CardCreateRequestDTO;
import com.example.pawify.dto.out.payment.CardResponseDTO;
import com.example.pawify.model.BuyerEntity;
import com.example.pawify.service.CardService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for payment card management operations.
 * <p>
 * Provides endpoints for creating, retrieving, updating, and deactivating
 * payment cards associated with the authenticated buyer.
 * </p>
 */
@RestController
@RequestMapping("/card")
@AllArgsConstructor
public class CardController {
    private final CardService cardService;

    /**
     * Creates a new payment card for the authenticated buyer.
     *
     * @param cardCreateRequestDTO the validated card creation request containing card details
     * @param buyerEntity the authenticated buyer extracted from the security context
     * @return {@link ResponseEntity} with HTTP 200 (OK) and the created card data
     */
    @PostMapping("")
    public ResponseEntity<CardResponseDTO> createCard(
        @Valid @RequestBody CardCreateRequestDTO cardCreateRequestDTO,
        @AuthenticationPrincipal BuyerEntity buyerEntity
        ) {
        return ResponseEntity.ok(cardService.createCard(cardCreateRequestDTO, buyerEntity));
    }

    /**
     * Retrieves all active payment cards belonging to the authenticated buyer.
     *
     * @param buyerEntity the authenticated buyer extracted from the security context
     * @return {@link ResponseEntity} with HTTP 200 (OK) and the list of card responses
     */
    @GetMapping("")
    public ResponseEntity<List<CardResponseDTO>> getAllCardsByBuyer(
        @AuthenticationPrincipal BuyerEntity buyerEntity
    ) {
        return ResponseEntity.ok(cardService.getCardsByBuyer(buyerEntity));
    }

    /**
     * Deactivates a payment card owned by the authenticated buyer.
     *
     * @param id the numeric ID of the card to deactivate
     * @param buyerEntity the authenticated buyer extracted from the security context
     * @return {@link ResponseEntity} with HTTP 204 (No Content) on success
     */
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateCard(
        @PathVariable Long id,
        @AuthenticationPrincipal BuyerEntity buyerEntity
    ) {
        cardService.deactivateCard(id, buyerEntity);
        return ResponseEntity.noContent().build();
    }

    /**
     * Updates an existing payment card belonging to the authenticated buyer.
     *
     * @param id the numeric ID of the card to update
     * @param buyerEntity the authenticated buyer extracted from the security context
     * @param cardCreateRequestDTO the validated card update data
     * @return {@link ResponseEntity} with HTTP 200 (OK) and the updated card data
     */
    @PutMapping("/{id}")
    public ResponseEntity<CardResponseDTO> updateCard(
        @PathVariable Long id,
        @AuthenticationPrincipal BuyerEntity buyerEntity,
        @Valid @RequestBody CardCreateRequestDTO cardCreateRequestDTO
    ) {
        return ResponseEntity.ok(cardService.updateCardByBuyer(id, cardCreateRequestDTO, buyerEntity));
    }
}
