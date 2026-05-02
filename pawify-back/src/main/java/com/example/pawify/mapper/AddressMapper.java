package com.example.pawify.mapper;

import com.example.pawify.dto.in.address.AddressCreateRequestDTO;
import com.example.pawify.dto.out.address.AddressResponseDTO;
import com.example.pawify.model.AddressEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface AddressMapper {
    AddressEntity toEntity(AddressCreateRequestDTO addressDTO);
    AddressResponseDTO toDTO(AddressEntity addressEntity);
}
