package com.example.pawify.service;

import com.example.pawify.dto.in.user.ChangePasswordRequestDTO;
import com.example.pawify.exception.BadRequestException;
import com.example.pawify.model.BuyerEntity;
import com.example.pawify.model.UserEntity;
import com.example.pawify.repository.UserRepository;
import com.example.pawify.service.implement.UserServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    @DisplayName("should throw BadRequestException when current password is incorrect")
    void shouldThrowWhenCurrentPasswordIncorrect() {
        BuyerEntity buyer = new BuyerEntity();
        buyer.setPassword("encodedOldPassword");

        ChangePasswordRequestDTO dto = new ChangePasswordRequestDTO(
            "newPassword123", "newPassword123", "wrongOldPassword"
        );

        when(passwordEncoder.matches("wrongOldPassword", "encodedOldPassword")).thenReturn(false);

        assertThatThrownBy(() -> userService.changePasswordByOwner(buyer, dto))
            .isInstanceOf(BadRequestException.class)
            .hasMessage("old password is incorrect");
    }

    @Test
    @DisplayName("should throw BadRequestException when new passwords don't match")
    void shouldThrowWhenPasswordsDontMatch() {
        BuyerEntity buyer = new BuyerEntity();
        buyer.setPassword("encodedOldPassword");

        ChangePasswordRequestDTO dto = new ChangePasswordRequestDTO(
            "newPassword123", "differentPassword456", "oldPassword"
        );

        when(passwordEncoder.matches("oldPassword", "encodedOldPassword")).thenReturn(true);

        assertThatThrownBy(() -> userService.changePasswordByOwner(buyer, dto))
            .isInstanceOf(BadRequestException.class)
            .hasMessage("new passwords don't match");
    }

    @Test
    @DisplayName("should change password successfully when data is valid")
    void shouldChangePasswordSuccessfully() {
        BuyerEntity buyer = new BuyerEntity();
        buyer.setPassword("encodedOldPassword");

        ChangePasswordRequestDTO dto = new ChangePasswordRequestDTO(
            "newPassword123", "newPassword123", "oldPassword"
        );

        when(passwordEncoder.matches("oldPassword", "encodedOldPassword")).thenReturn(true);
        when(passwordEncoder.encode("newPassword123")).thenReturn("encodedNewPassword");
        when(userRepository.save(buyer)).thenReturn(buyer);

        userService.changePasswordByOwner(buyer, dto);

        verify(userRepository).save(buyer);
    }
}
