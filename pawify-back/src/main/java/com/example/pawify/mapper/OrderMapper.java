package com.example.pawify.mapper;

import com.example.pawify.dto.out.admin.OrderSimpleResponseDTO;
import com.example.pawify.dto.out.order.OrderResponseDTO;
import com.example.pawify.model.OrderEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    uses = {DetailMapper.class, BuyerMapper.class}
)
public interface OrderMapper {
    OrderResponseDTO toResponseDTO(OrderEntity orderEntity);
    OrderSimpleResponseDTO fromEntityToSimpleDTO(OrderEntity orderEntity);
}
