package com.example.pawify.service.implement;

import com.example.pawify.dto.in.user.ChangePasswordRequestDTO;
import com.example.pawify.exception.BadRequestException;
import com.example.pawify.model.UserEntity;
import com.example.pawify.repository.UserRepository;
import com.example.pawify.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Override
    public void changePasswordByOwner(UserEntity user, ChangePasswordRequestDTO requestDTO) {
        if (!passwordEncoder.matches(requestDTO.currentPassword(), user.getPassword())) {
            throw new BadRequestException("old password is incorrect");
        }

        if (!requestDTO.newPassword().equals(requestDTO.confirmNewPassword())) {
            throw new BadRequestException("new passwords don't match");
        }

        user.setPassword(passwordEncoder.encode(requestDTO.newPassword()));
        userRepository.save(user);
    }
}
