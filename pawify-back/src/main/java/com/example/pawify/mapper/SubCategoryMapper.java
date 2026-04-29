package com.example.pawify.mapper;

import com.example.pawify.dto.out.product.SubCategoryResponseDTO;
import com.example.pawify.model.SubCategoryEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface SubCategoryMapper {
    SubCategoryResponseDTO toDTO(SubCategoryEntity entity);
}
