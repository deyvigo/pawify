package com.example.pawify.mapper;

import com.example.pawify.dto.in.auth.BuyerRegisterRequestDTO;
import com.example.pawify.dto.out.auth.BuyerRegisterResponseDTO;
import com.example.pawify.model.BuyerEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface BuyerMapper {
    BuyerEntity toEntity(BuyerRegisterRequestDTO buyerRegisterRequestDTO);
    BuyerRegisterResponseDTO toResponseDTO(BuyerEntity buyerEntity);
}
