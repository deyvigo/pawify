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

// Controlador de tarjetas de pago
@RestController
@RequestMapping("/card")
@AllArgsConstructor
public class CardController {
    private final CardService cardService;

    // Crea una nueva tarjeta de pago para el comprador
    @PostMapping("")
    public ResponseEntity<CardResponseDTO> createCard(
        @Valid @RequestBody CardCreateRequestDTO cardCreateRequestDTO,
        @AuthenticationPrincipal BuyerEntity buyerEntity
        ) {
        return ResponseEntity.ok(cardService.createCard(cardCreateRequestDTO, buyerEntity));
    }

    // Lista todas las tarjetas activas del comprador
    @GetMapping("")
    public ResponseEntity<List<CardResponseDTO>> getAllCardsByBuyer(
        @AuthenticationPrincipal BuyerEntity buyerEntity
    ) {
        return ResponseEntity.ok(cardService.getCardsByBuyer(buyerEntity));
    }

    // Desactiva una tarjeta de pago del comprador
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateCard(
        @PathVariable Long id,
        @AuthenticationPrincipal BuyerEntity buyerEntity
    ) {
        cardService.deactivateCard(id, buyerEntity);
        return ResponseEntity.noContent().build();
    }

    // Actualiza una tarjeta de pago existente del comprador
    @PutMapping("/{id}")
    public ResponseEntity<CardResponseDTO> updateCard(
        @PathVariable Long id,
        @AuthenticationPrincipal BuyerEntity buyerEntity,
        @Valid @RequestBody CardCreateRequestDTO cardCreateRequestDTO
    ) {
        return ResponseEntity.ok(cardService.updateCardByBuyer(id, cardCreateRequestDTO, buyerEntity));
    }
}
