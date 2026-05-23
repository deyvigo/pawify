package com.example.pawify.mapper;

import com.example.pawify.dto.out.review.ReviewResponseDTO;
import com.example.pawify.model.ReviewEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    uses = {ReviewImageMapper.class, BuyerMapper.class}
)
public interface ReviewMapper {
    ReviewResponseDTO toResponseDTO(ReviewEntity reviewEntity);
}
