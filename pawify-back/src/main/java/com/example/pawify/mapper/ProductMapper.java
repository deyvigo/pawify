package com.example.pawify.mapper;

import com.example.pawify.dto.in.product.ProductCreateRequestDTO;
import com.example.pawify.dto.out.product.ProductResponseDTO;
import com.example.pawify.model.ProductEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    uses = {ImageMapper.class, BrandMapper.class}
)
public interface ProductMapper {
    @Mapping(target = "brand", ignore = true)
    ProductEntity toEntity(ProductCreateRequestDTO dto);

    @Mapping(source = "images", target = "images")
    @Mapping(source = "brand", target = "brand")
    ProductResponseDTO toResponseDTO(ProductEntity productEntity);
}
