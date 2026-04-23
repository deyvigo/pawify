package com.example.pawify.mapper;

import com.example.pawify.dto.out.product.ImageResponseDTO;
import com.example.pawify.model.ImageEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ImageMapper {
    ImageResponseDTO toResponseDTO(ImageEntity imageEntity);
}
