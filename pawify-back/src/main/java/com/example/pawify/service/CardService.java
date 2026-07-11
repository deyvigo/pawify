package com.example.pawify.service;

import com.example.pawify.dto.in.payment.CardCreateRequestDTO;
import com.example.pawify.dto.out.payment.CardResponseDTO;
import com.example.pawify.model.BuyerEntity;

import java.util.List;

/**
 * Service interface for managing buyer payment cards.
 *
 * <p>Provides operations for creating, retrieving, deactivating, and
 * updating payment cards. Only the card owner may deactivate or update
 * a card. Only the last four digits of the card number are persisted.</p>
 */
public interface CardService {

    /**
     * Creates a new payment card for the specified buyer.
     *
     * <p>Validates that the card is not expired before saving. Stores only
     * the last four digits of the card number for security.</p>
     *
     * @param cardCreateRequestDTO the data transfer object containing card details
     * @param buyerEntity the buyer to whom the card belongs
     * @return the response DTO with the created card information
     * @throws com.example.pawify.exception.CardExpiredException if the card's due date is in the past
     */
    CardResponseDTO createCard(CardCreateRequestDTO cardCreateRequestDTO, BuyerEntity buyerEntity);

    /**
     * Retrieves all active payment cards for the specified buyer.
     *
     * @param buyerEntity the buyer whose cards are to be retrieved
     * @return an immutable list of active card response DTOs
     */
    List<CardResponseDTO> getCardsByBuyer(BuyerEntity buyerEntity);

    /**
     * Deactivates a payment card by its identifier.
     *
     * <p>Validates that the requesting buyer is the owner of the card.
     * If the card is already inactive, no action is taken.</p>
     *
     * @param cardId the unique identifier of the card to deactivate
     * @param buyerEntity the authenticated buyer entity
     * @throws com.example.pawify.exception.ResourceNotFoundException if the card is not found
     * @throws com.example.pawify.exception.UnauthorizedRequestException if the buyer is not the card owner
     */
    void deactivateCard(Long cardId, BuyerEntity buyerEntity);

    /**
     * Updates an existing payment card's details.
     *
     * <p>Validates that the requesting buyer is the owner of the card.
     * Stores only the last four digits of the new card number.</p>
     *
     * @param cardId the unique identifier of the card to update
     * @param cardCreateRequestDTO the data transfer object containing the updated card details
     * @param buyerEntity the authenticated buyer entity
     * @return the response DTO with the updated card information
     * @throws com.example.pawify.exception.ResourceNotFoundException if the card is not found
     * @throws com.example.pawify.exception.UnauthorizedRequestException if the buyer is not the card owner
     */
    CardResponseDTO updateCardByBuyer(Long cardId, CardCreateRequestDTO cardCreateRequestDTO, BuyerEntity buyerEntity);
}
