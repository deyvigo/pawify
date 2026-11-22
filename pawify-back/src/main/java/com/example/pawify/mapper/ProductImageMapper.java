package com.example.pawify.mapper;

import com.example.pawify.dto.out.product.ProductImageResponseDTO;
import com.example.pawify.model.ProductImageEntity;
import com.example.pawify.service.implement.CloudinaryUrlResolver;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public abstract class ProductImageMapper {

    @Autowired
    protected CloudinaryUrlResolver urlResolver;

    @Mapping(
        target = "url",
        expression = "java(urlResolver.resolve(productImageEntity.getPublicId(), productImageEntity.getUrl()))"
    )
    public abstract ProductImageResponseDTO toResponseDTO(ProductImageEntity productImageEntity);
}
