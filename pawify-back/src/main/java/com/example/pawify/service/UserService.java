package com.example.pawify.service;

import com.example.pawify.dto.in.user.ChangePasswordRequestDTO;
import com.example.pawify.model.UserEntity;

// Servicio de gestion de cuenta de usuario
public interface UserService {

    // Cambia la contrasena del usuario autenticado validando la actual
    void changePasswordByOwner(UserEntity user, ChangePasswordRequestDTO requestDTO);
}
