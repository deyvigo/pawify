package com.example.pawify.mapper;

import com.example.pawify.dto.in.auth.BuyerRegisterRequestDTO;
import com.example.pawify.dto.out.auth.BuyerRegisterResponseDTO;
import com.example.pawify.dto.out.user.BuyerResponseSimpleDTO;
import com.example.pawify.model.BuyerEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    uses = {ImageMapper.class, CardMapper.class, AddressMapper.class}
)
public interface BuyerMapper {
    BuyerEntity toEntity(BuyerRegisterRequestDTO buyerRegisterRequestDTO);
    BuyerRegisterResponseDTO toResponseDTO(BuyerEntity buyerEntity);
    @Mapping(
        target = "countCards",
        expression = "java(buyerEntity.getCards() != null ? buyerEntity.getCards().size() : 0)"
    )
    @Mapping(
        target = "countAddresses",
        expression = "java(buyerEntity.getAddresses() != null ? buyerEntity.getAddresses().size() : 0)"
    )
    BuyerResponseSimpleDTO toResponseSimpleDTO(BuyerEntity buyerEntity);
}
