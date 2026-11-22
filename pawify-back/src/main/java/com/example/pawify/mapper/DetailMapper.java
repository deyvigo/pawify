package com.example.pawify.mapper;

import com.example.pawify.dto.out.order.DetailResponseDTO;
import com.example.pawify.model.DetailEntity;
import com.example.pawify.model.ProductEntity;
import com.example.pawify.service.implement.CloudinaryUrlResolver;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public abstract class DetailMapper {

    @Autowired
    protected CloudinaryUrlResolver urlResolver;

    @Mapping(
        target = "productName",
        expression = "java(detailEntity.getProduct().getName())"
    )
    @Mapping(
        target = "productImage",
        expression = "java(productImage(detailEntity.getProduct()))"
    )
    @Mapping(
        target = "price",
        expression = "java(detailEntity.getProduct().getPrice())"
    )
    public abstract DetailResponseDTO toResponseDTO(DetailEntity detailEntity);

    protected String productImage(ProductEntity product) {
        if (product == null || product.getImages() == null) {
            return null;
        }

        return product.getImages().stream()
            .findFirst()
            .map(image -> urlResolver.resolve(image.getPublicId(), image.getUrl()))
            .orElse(null);
    }
}
