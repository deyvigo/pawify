package com.example.pawify.mapper;

import com.example.pawify.dto.out.product.CategoryResponseDTO;
import com.example.pawify.dto.out.product.CategorySimpleDTO;
import com.example.pawify.model.CategoryEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    uses = SubCategoryMapper.class
)
public interface CategoryMapper {
    @Mapping(target = "subCategories", source = "subCategories")
    CategoryResponseDTO toDTO(CategoryEntity entity);

    CategorySimpleDTO toSimpleDTO(CategoryEntity entity);
}
