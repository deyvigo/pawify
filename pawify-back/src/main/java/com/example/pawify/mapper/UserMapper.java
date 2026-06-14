package com.example.pawify.mapper;

import com.example.pawify.dto.out.claim.UserResponseDTO;
import com.example.pawify.model.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {
    UserResponseDTO fromEntityToDTO(UserEntity userEntity);
}
