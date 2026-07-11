package com.example.pawify.service;

import com.example.pawify.dto.in.user.ChangePasswordRequestDTO;
import com.example.pawify.model.UserEntity;

/**
 * Service interface for user account management operations.
 *
 * <p>Provides operations for authenticated users to manage their own
 * account settings, such as changing their password.</p>
 */
public interface UserService {

    /**
     * Changes the password of the authenticated user after verifying the current password.
     *
     * <p>Validates that the current password matches the stored hash and that
     * the new password and confirmation match. The new password is encoded
     * before being persisted.</p>
     *
     * @param user the authenticated user entity whose password is being changed
     * @param requestDTO the data transfer object containing the current password, new password, and confirmation
     * @throws com.example.pawify.exception.BadRequestException if the current password is incorrect or the new passwords do not match
     */
    void changePasswordByOwner(UserEntity user, ChangePasswordRequestDTO requestDTO);
}
