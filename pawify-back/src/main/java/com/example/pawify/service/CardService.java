package com.example.pawify.service;

import com.example.pawify.dto.in.payment.CardCreateRequestDTO;
import com.example.pawify.dto.out.payment.CardResponseDTO;
import com.example.pawify.model.BuyerEntity;

import java.util.List;

public interface CardService {
    CardResponseDTO createCard(CardCreateRequestDTO cardCreateRequestDTO, BuyerEntity buyerEntity);
    List<CardResponseDTO> getCardsByBuyer(BuyerEntity buyerEntity);
    void deactivateCard(Long cardId, BuyerEntity buyerEntity);
    CardResponseDTO updateCardByBuyer(Long cardId, CardCreateRequestDTO cardCreateRequestDTO, BuyerEntity buyerEntity);
}
