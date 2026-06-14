package com.example.pawify.mapper;

import com.example.pawify.dto.out.claim.MessageResponseDTO;
import com.example.pawify.model.MessageEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.Mappings;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    uses = {BuyerMapper.class, DetailMapper.class}
)
public interface MessageMapper {
    @Mappings({
        @Mapping(target = "claimId", source = "claim.id"),
        @Mapping(target = "buyer", source = "claim.buyer"),
        @Mapping(target = "detail", source = "claim.detail")
    })
    MessageResponseDTO fromEntityToDTO(MessageEntity message);
}
