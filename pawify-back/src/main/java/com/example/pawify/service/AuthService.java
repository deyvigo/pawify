package com.example.pawify.service;

import com.example.pawify.dto.in.auth.*;
import com.example.pawify.dto.out.auth.*;

/**
 * Service interface responsible for authentication, registration,
 * token management, and password recovery operations.
 *
 * <p>This service handles admin and buyer registration, user login
 * with JWT token generation, refresh token validation, and the full
 * password recovery flow including code generation, verification,
 * and password reset.</p>
 */
public interface AuthService {

    /**
     * Registers a new admin user in the system.
     *
     * <p>Validates that the username and DNI number are not already in use,
     * encodes the password, assigns the ADMIN role, and persists the entity.</p>
     *
     * @param adminRegisterRequestDTO the data transfer object containing admin registration details
     * @return the response DTO with the newly created admin information
     * @throws com.example.pawify.exception.UsernameAlreadyUsedException if the username is already taken
     * @throws com.example.pawify.exception.CredentialsAlreadyInUseException if the DNI number is already registered
     * @throws com.example.pawify.exception.ResourceNotFoundException if the ADMIN role cannot be found
     */
    AdminRegisterResponseDTO registerAdmin(AdminRegisterRequestDTO adminRegisterRequestDTO);

    /**
     * Registers a new buyer user in the system.
     *
     * <p>Validates that the username, DNI number, and email are not already in use,
     * encodes the password, assigns the BUYER role, and persists the entity.</p>
     *
     * @param buyerRegisterRequestDTO the data transfer object containing buyer registration details
     * @return the response DTO with the newly created buyer information
     * @throws com.example.pawify.exception.UsernameAlreadyUsedException if the username is already taken
     * @throws com.example.pawify.exception.CredentialsAlreadyInUseException if the DNI number or email is already registered
     * @throws com.example.pawify.exception.ResourceNotFoundException if the BUYER role cannot be found
     */
    BuyerRegisterResponseDTO registerBuyer(BuyerRegisterRequestDTO buyerRegisterRequestDTO);

    /**
     * Authenticates a user and issues JWT tokens.
     *
     * <p>Validates the provided credentials against stored values and,
     * upon successful authentication, generates both an access token
     * and a refresh token.</p>
     *
     * @param loginRequestDTO the data transfer object containing username and password
     * @return a {@link JwtDTO} containing the access and refresh tokens
     * @throws com.example.pawify.exception.UserInvalidCredentialsException if the username does not exist or the password is incorrect
     */
    JwtDTO login(LoginRequestDTO loginRequestDTO);

    /**
     * Refreshes the access token using a valid refresh token.
     *
     * <p>Validates the refresh token, retrieves the associated user, and
     * issues new access and refresh tokens.</p>
     *
     * @param refreshToken the data transfer object containing the refresh token
     * @return a {@link JwtDTO} containing the new access and refresh tokens
     * @throws com.example.pawify.exception.UserInvalidCredentialsException if the refresh token is invalid or the user is not found
     */
    JwtDTO refreshToken(LoginWithTokensRequestDTO refreshToken);

    /**
     * Sends a password recovery code to the buyer's email address.
     *
     * <p>Generates a 6-digit recovery code, hashes it, stores it as a
     * password reset token with a 1-hour expiration, and sends the code
     * via email. Any previously unused tokens for the user are deleted.</p>
     *
     * @param dto the data transfer object containing the username for recovery
     * @return a response DTO with the masked email address, or null if the email could not be sent
     * @throws com.example.pawify.exception.ResourceNotFoundException if the username does not exist
     */
    UsernameVerificationResponseDTO sendRecoveryCode(RecoveryCodeRequestDTO dto);

    /**
     * Verifies a password recovery token for a given username.
     *
     * <p>Checks that the token exists, has not been used, has not expired,
     * and that the provided code matches the stored hash.</p>
     *
     * @param username the username of the user performing verification
     * @param token the recovery code to verify
     * @return a response DTO indicating whether verification was successful
     * @throws com.example.pawify.exception.InvalidRecoveryCodeException if the username is not found, the token is invalid, or the token has expired
     */
    VerificationCodeResponseDTO verifyToken(String username, String token);

    /**
     * Resets the user's password using a valid recovery code.
     *
     * <p>Validates the recovery token, encodes the new password,
     * saves it to the database, and marks the token as used.
     * This operation is transactional.</p>
     *
     * @param dto the data transfer object containing the username, recovery code, and new password
     * @throws com.example.pawify.exception.InvalidRecoveryCodeException if the username is not found, the token is invalid, or the token has expired
     */
    void resetPassword(PasswordRecoveryRequestDTO dto);
}
