package com.example.pawify.service;

import com.example.pawify.dto.in.user.ChangePasswordRequestDTO;
import com.example.pawify.model.UserEntity;

public interface UserService {
    void changePasswordByOwner(UserEntity user, ChangePasswordRequestDTO requestDTO);
}
