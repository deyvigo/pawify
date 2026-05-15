package com.example.pawify.mapper;

import com.example.pawify.dto.in.payment.CardCreateRequestDTO;
import com.example.pawify.dto.out.payment.CardResponseDTO;
import com.example.pawify.model.CardEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CardMapper {
    CardEntity toEntity(CardCreateRequestDTO cardCreateRequestDTO);
    CardResponseDTO toResponseDTO(CardEntity cardEntity);
}
