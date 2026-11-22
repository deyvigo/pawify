package com.example.pawify.mapper;

import com.example.pawify.dto.out.buyer.BuyerImageResponseDTO;
import com.example.pawify.model.BuyerImageEntity;
import com.example.pawify.service.implement.CloudinaryUrlResolver;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public abstract class BuyerProfileMapper {

    @Autowired
    protected CloudinaryUrlResolver urlResolver;

    @Mapping(
        target = "url",
        expression = "java(urlResolver.resolve(buyerImageEntity.getPublicId(), buyerImageEntity.getUrl()))"
    )
    public abstract BuyerImageResponseDTO toDTO(BuyerImageEntity buyerImageEntity);
}
