package com.example.pawify.mapper;

import com.example.pawify.dto.out.review.ReviewImageResponseDTO;
import com.example.pawify.model.ReviewImageEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ReviewImageMapper {
    ReviewImageResponseDTO toResponseDTO(ReviewImageEntity entity);
}
