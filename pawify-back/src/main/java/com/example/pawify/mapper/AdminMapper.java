package com.example.pawify.mapper;

import com.example.pawify.dto.in.auth.AdminRegisterRequestDTO;
import com.example.pawify.dto.out.auth.AdminRegisterResponseDTO;
import com.example.pawify.model.AdminEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface AdminMapper {
    AdminEntity toEntity(AdminRegisterRequestDTO adminRegisterRequestDTO);
    AdminRegisterResponseDTO toResponseDTO(AdminEntity adminEntity);
}
