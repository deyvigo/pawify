package com.example.pawify.mapper;

import com.example.pawify.dto.in.product.ProductCreateRequestDTO;
import com.example.pawify.dto.out.product.ProductResponseDTO;
import com.example.pawify.model.ProductEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    uses = {ImageMapper.class, BrandMapper.class, CategoryMapper.class, SubCategoryMapper.class}
)
public interface ProductMapper {
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "subCategory", ignore = true)
    ProductEntity toEntity(ProductCreateRequestDTO dto);

    @Mapping(source = "images", target = "images")
    @Mapping(source = "brand", target = "brand")
    @Mapping(source = "category", target = "category")
    ProductResponseDTO toResponseDTO(ProductEntity productEntity);
}
