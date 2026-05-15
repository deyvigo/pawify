package com.example.pawify.mapper;

import com.example.pawify.dto.in.order.TrackingStatusCreateRequestDTO;
import com.example.pawify.dto.out.order.TrackingStatusResponseDTO;
import com.example.pawify.model.TrackingStatusEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface TrackingStatusMapper {
    TrackingStatusResponseDTO fromEntityToDTO(TrackingStatusEntity entity);
    TrackingStatusEntity fromDTORequestToEntity(TrackingStatusCreateRequestDTO requestDTO);
}
