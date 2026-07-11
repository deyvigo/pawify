package com.example.pawify.controller;

import com.example.pawify.dto.in.auth.*;
import com.example.pawify.dto.out.auth.*;
import com.example.pawify.service.AuthService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for authentication and authorization operations.
 * <p>
 * Manages user registration (admin and buyer), login, JWT token refresh,
 * and password recovery workflows.
 * </p>
 *
 * <p>All endpoints are mounted under the {@code /auth} base path.</p>
 */
@RestController
@RequestMapping(path = "/auth")
@AllArgsConstructor
public class AuthController {
    private AuthService authService;

    /**
     * Registers a new admin user.
     *
     * @param dto the validated admin registration request containing email, password, and personal data
     * @return {@link ResponseEntity} with HTTP 201 (Created) and the created admin data
     * @throws org.springframework.web.server.ResponseStatusException if the email is already registered or validation fails
     */
    @PostMapping("/register/admin")
    public ResponseEntity<AdminRegisterResponseDTO> registerAdmin(@Valid @RequestBody AdminRegisterRequestDTO dto) {
        AdminRegisterResponseDTO adminDTO = authService.registerAdmin(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(adminDTO);
    }

    /**
     * Registers a new buyer (customer) user.
     *
     * @param dto the validated buyer registration request containing email, password, and personal data
     * @return {@link ResponseEntity} with HTTP 201 (Created) and the created buyer data
     * @throws org.springframework.web.server.ResponseStatusException if the email is already registered or validation fails
     */
    @PostMapping("/register/buyer")
    public ResponseEntity<BuyerRegisterResponseDTO> registerBuyer(@Valid @RequestBody BuyerRegisterRequestDTO dto) {
        BuyerRegisterResponseDTO buyerDTO = authService.registerBuyer(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(buyerDTO);
    }

    /**
     * Authenticates a user and returns a JWT access token and refresh token.
     *
     * @param dto the validated login request containing email and password
     * @return {@link ResponseEntity} with HTTP 200 (OK) and the JWT tokens
     * @throws org.springframework.web.server.ResponseStatusException if credentials are invalid
     */
    @PostMapping("/login")
    public ResponseEntity<JwtDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        JwtDTO jwtDTO = authService.login(dto);
        return ResponseEntity.status(HttpStatus.OK).body(jwtDTO);
    }

    /**
     * Refreshes an expired or soon-to-expire JWT access token using a valid refresh token.
     *
     * @param dto the validated request containing the current access token and refresh token
     * @return {@link ResponseEntity} with HTTP 200 (OK) and newly issued JWT tokens
     * @throws org.springframework.web.server.ResponseStatusException if the refresh token is invalid or expired
     */
    @PostMapping("/refresh")
    public ResponseEntity<JwtDTO> refreshToken(@Valid @RequestBody LoginWithTokensRequestDTO dto) {
        JwtDTO jwtDTO = authService.refreshToken(dto);
        return ResponseEntity.status(HttpStatus.OK).body(jwtDTO);
    }

    /**
     * Initiates the password recovery process by sending a verification code to the user's email.
     *
     * @param dto the validated recovery code request containing the user's email address
     * @return {@link ResponseEntity} with HTTP 200 (OK) and a username verification response
     * @throws org.springframework.web.server.ResponseStatusException if the email does not exist
     */
    @PostMapping("/recovery/request-code")
    public ResponseEntity<UsernameVerificationResponseDTO> requestRecoveryCode(@Valid @RequestBody RecoveryCodeRequestDTO dto) {
        return ResponseEntity.ok(authService.sendRecoveryCode(dto));
    }

    /**
     * Verifies the recovery code sent to the user's email during the password recovery process.
     *
     * @param dto the validated verification code request containing the username and the received code
     * @return {@link ResponseEntity} with HTTP 200 (OK) and a verification code response including a recovery token
     * @throws org.springframework.web.server.ResponseStatusException if the code is invalid or expired
     */
    @PostMapping("/recovery/verify-code")
    public ResponseEntity<VerificationCodeResponseDTO> verifyToken(
        @Valid @RequestBody VerificationCodeRequestDTO dto
    ) {
        return ResponseEntity.ok(authService.verifyToken(dto.username(), dto.code()));
    }

    /**
     * Resets the user's password using a valid recovery token obtained after code verification.
     *
     * @param dto the validated password recovery request containing the recovery token and the new password
     * @return {@link ResponseEntity} with HTTP 200 (OK) and no body
     * @throws org.springframework.web.server.ResponseStatusException if the recovery token is invalid or expired
     */
    @PostMapping("/recovery/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody PasswordRecoveryRequestDTO dto) {
        authService.resetPassword(dto);
        return ResponseEntity.ok().build();
    }
}
