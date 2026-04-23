package com.example.pawify.mapper;

import com.example.pawify.dto.out.product.BrandResponseDTO;
import com.example.pawify.model.BrandEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface BrandMapper {
    BrandResponseDTO toDTO(BrandEntity entity);
}
