package com.example.pawify.mapper;

import com.example.pawify.dto.out.order.DetailResponseDTO;
import com.example.pawify.model.DetailEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface DetailMapper {
    @Mapping(
        target = "productName",
        expression = "java(detailEntity.getProduct().getName())"
    )
    @Mapping(
        target = "productImage",
        expression = "java(detailEntity.getProduct().getImages()" +
            ".stream().findFirst().map(img -> img.getUrl()).orElse(null))"
    )
    @Mapping(
        target = "price",
        expression = "java(detailEntity.getProduct().getPrice())"
    )
    DetailResponseDTO toResponseDTO(DetailEntity detailEntity);
}
