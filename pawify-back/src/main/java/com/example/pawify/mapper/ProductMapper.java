package com.example.pawify.mapper;

import com.example.pawify.dto.in.product.ProductCreateRequestDTO;
import com.example.pawify.dto.out.product.ProductResponseDTO;
import com.example.pawify.model.ProductEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    uses = ImageMapper.class
)
public interface ProductMapper {
    ProductEntity toEntity(ProductCreateRequestDTO dto);

    @Mapping(source = "images", target = "images")
    ProductResponseDTO toResponseDTO(ProductEntity productEntity);
}
