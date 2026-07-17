package com.example.pawify.service;

import com.example.pawify.dto.in.payment.CardCreateRequestDTO;
import com.example.pawify.dto.out.payment.CardResponseDTO;
import com.example.pawify.model.BuyerEntity;

import java.util.List;

// Servicio de gestion de tarjetas de pago del comprador
public interface CardService {

    // Crea una tarjeta validando que no este vencida, guarda solo ultimos 4 digitos
    CardResponseDTO createCard(CardCreateRequestDTO cardCreateRequestDTO, BuyerEntity buyerEntity);

    // Lista las tarjetas activas de un comprador
    List<CardResponseDTO> getCardsByBuyer(BuyerEntity buyerEntity);

    // Desactiva una tarjeta validando que el comprador sea el propietario
    void deactivateCard(Long cardId, BuyerEntity buyerEntity);

    // Actualiza los datos de una tarjeta validando propiedad
    CardResponseDTO updateCardByBuyer(Long cardId, CardCreateRequestDTO cardCreateRequestDTO, BuyerEntity buyerEntity);
}
