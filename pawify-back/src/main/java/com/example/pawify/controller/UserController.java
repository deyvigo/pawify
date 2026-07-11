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

/**
 * REST controller for user self-service operations.
 * <p>
 * Provides endpoints that allow authenticated users to manage their own account,
 * such as changing their password.
 * </p>
 */
@RestController
@RequestMapping("/user")
@AllArgsConstructor
public class UserController {
    private final UserService userService;

    /**
     * Changes the password of the authenticated user.
     * <p>
     * Requires the user to provide their current password for verification
     * along with the desired new password.
     * </p>
     *
     * @param userEntity the authenticated user extracted from the security context
     * @param changePasswordRequestDTO the validated request containing current and new password
     * @return {@link ResponseEntity} with HTTP 204 (No Content) on success
     */
    @PostMapping("/password")
    public ResponseEntity<Void> changePassword(
        @AuthenticationPrincipal UserEntity userEntity,
        @Valid @RequestBody ChangePasswordRequestDTO changePasswordRequestDTO
    ) {
        userService.changePasswordByOwner(userEntity, changePasswordRequestDTO);
        return ResponseEntity.noContent().build();
    }
}
