package com.example.pawify.service.implement;

import com.example.pawify.dto.in.payment.CardCreateRequestDTO;
import com.example.pawify.dto.out.payment.CardResponseDTO;
import com.example.pawify.exception.CardExpiredException;
import com.example.pawify.exception.ResourceNotFoundException;
import com.example.pawify.exception.UnauthorizedRequestException;
import com.example.pawify.mapper.CardMapper;
import com.example.pawify.model.BuyerEntity;
import com.example.pawify.model.CardEntity;
import com.example.pawify.repository.CardRepository;
import com.example.pawify.service.CardService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.List;

// Implementacion del servicio de gestion de tarjetas de pago
@Service
@AllArgsConstructor
public class CardServiceImpl implements CardService {
    private final CardRepository cardRepository;
    private final CardMapper cardMapper;

    // Crea una tarjeta validando vencimiento y guardando solo ultimos 4 digitos
    @Override
    public CardResponseDTO createCard(CardCreateRequestDTO cardCreateRequestDTO, BuyerEntity buyerEntity) {
        if (cardCreateRequestDTO.dueDate().isBefore(YearMonth.now())) {
            throw new CardExpiredException("card is expired");
        }

        String number = cardCreateRequestDTO.number();
        String lastFourDigits = number.substring(number.length() - 4);

        CardEntity cardEntity = cardMapper.toEntity(cardCreateRequestDTO);
        cardEntity.setBuyer(buyerEntity);
        cardEntity.setNumber(lastFourDigits);
        CardEntity savedCardEntity = cardRepository.save(cardEntity);

        return cardMapper.toResponseDTO(savedCardEntity);
    }

    // Lista tarjetas activas de un comprador
    @Override
    public List<CardResponseDTO> getCardsByBuyer(BuyerEntity buyerEntity) {
        return cardRepository.findAllByBuyerAndActiveTrue(buyerEntity).stream()
            .map(cardMapper::toResponseDTO)
            .toList();
    }

    // Desactiva una tarjeta validando que el comprador sea el propietario
    @Override
    public void deactivateCard(Long cardId, BuyerEntity buyerEntity) {
        CardEntity cardInDb = cardRepository.findById(cardId)
            .orElseThrow(() -> new ResourceNotFoundException("Card not found"));

        if (!cardInDb.getBuyer().getId().equals(buyerEntity.getId())) {
            throw new UnauthorizedRequestException("You are not allowed to deactivate this card (not owner)");
        }

        if (!cardInDb.getActive()) return;

        cardInDb.setActive(false);
        cardRepository.save(cardInDb);
    }

    // Actualiza datos de tarjeta validando propiedad
    @Override
    public CardResponseDTO updateCardByBuyer(Long cardId, CardCreateRequestDTO cardCreateRequestDTO, BuyerEntity buyerEntity) {
        CardEntity cardInDb = cardRepository.findById(cardId)
            .orElseThrow(() -> new ResourceNotFoundException("Card not found"));

        if (!cardInDb.getBuyer().getId().equals(buyerEntity.getId())) {
            throw new UnauthorizedRequestException("You are not allowed to update this card (not owner)");
        }

        String number = cardCreateRequestDTO.number();
        String lastFourDigits = number.substring(number.length() - 4);

        cardInDb.setNumber(lastFourDigits);
        cardInDb.setName(cardCreateRequestDTO.name());
        cardInDb.setDueDate(cardCreateRequestDTO.dueDate());
        return cardMapper.toResponseDTO(cardRepository.save(cardInDb));
    }
}
