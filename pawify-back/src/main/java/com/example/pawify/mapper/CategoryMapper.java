package com.example.pawify.mapper;

import com.example.pawify.dto.out.product.CategoryResponseDTO;
import com.example.pawify.model.CategoryEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CategoryMapper {
    CategoryResponseDTO toDTO(CategoryEntity entity);
}
