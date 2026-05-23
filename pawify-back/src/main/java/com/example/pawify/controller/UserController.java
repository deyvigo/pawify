package com.example.pawify.controller;

import com.example.pawify.dto.in.user.ChangePasswordRequestDTO;
import com.example.pawify.model.UserEntity;
import com.example.pawify.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@AllArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/password")
    public ResponseEntity<Void> changePassword(
        @AuthenticationPrincipal UserEntity userEntity,
        @Valid @RequestBody ChangePasswordRequestDTO changePasswordRequestDTO
    ) {
        userService.changePasswordByOwner(userEntity, changePasswordRequestDTO);
        return ResponseEntity.noContent().build();
    }
}
