package com.example.pawify.mapper;

import com.example.pawify.dto.out.buyer.BuyerImageResponseDTO;
import com.example.pawify.model.BuyerImageEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface BuyerProfileMapper {
    BuyerImageResponseDTO toDTO(BuyerImageEntity buyerImageEntity);
}
