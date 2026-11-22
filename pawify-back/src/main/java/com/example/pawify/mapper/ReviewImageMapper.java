package com.example.pawify.mapper;

import com.example.pawify.dto.out.review.ReviewImageResponseDTO;
import com.example.pawify.model.ReviewImageEntity;
import com.example.pawify.service.implement.CloudinaryUrlResolver;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public abstract class ReviewImageMapper {

    @Autowired
    protected CloudinaryUrlResolver urlResolver;

    @Mapping(
        target = "url",
        expression = "java(urlResolver.resolve(entity.getPublicId(), entity.getUrl()))"
    )
    public abstract ReviewImageResponseDTO toResponseDTO(ReviewImageEntity entity);
}
