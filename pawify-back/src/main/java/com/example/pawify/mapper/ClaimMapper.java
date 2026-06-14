package com.example.pawify.mapper;

import com.example.pawify.dto.out.claim.ClaimResponseDTO;
import com.example.pawify.model.ClaimEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    uses = {AdminMapper.class, BuyerMapper.class, DetailMapper.class}
)
public interface ClaimMapper {
    ClaimResponseDTO fromEntityToDTO(ClaimEntity claimEntity);
}
