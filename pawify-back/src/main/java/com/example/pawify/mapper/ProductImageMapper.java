package com.example.pawify.mapper;

import com.example.pawify.dto.out.product.ProductImageResponseDTO;
import com.example.pawify.model.ProductImageEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ProductImageMapper {
    ProductImageResponseDTO toResponseDTO(ProductImageEntity productImageEntity);
}
