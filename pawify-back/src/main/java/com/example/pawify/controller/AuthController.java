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

// Controlador de autenticacion y registro de usuarios
@RestController
@RequestMapping(path = "/auth")
@AllArgsConstructor
public class AuthController {
    private AuthService authService;

    // Registra un nuevo administrador
    @PostMapping("/register/admin")
    public ResponseEntity<AdminRegisterResponseDTO> registerAdmin(@Valid @RequestBody AdminRegisterRequestDTO dto) {
        AdminRegisterResponseDTO adminDTO = authService.registerAdmin(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(adminDTO);
    }

    // Registra un nuevo comprador
    @PostMapping("/register/buyer")
    public ResponseEntity<BuyerRegisterResponseDTO> registerBuyer(@Valid @RequestBody BuyerRegisterRequestDTO dto) {
        BuyerRegisterResponseDTO buyerDTO = authService.registerBuyer(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(buyerDTO);
    }

    // Inicia sesion y retorna tokens JWT
    @PostMapping("/login")
    public ResponseEntity<JwtDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        JwtDTO jwtDTO = authService.login(dto);
        return ResponseEntity.status(HttpStatus.OK).body(jwtDTO);
    }

    // Refresca el token JWT usando un refresh token
    @PostMapping("/refresh")
    public ResponseEntity<JwtDTO> refreshToken(@Valid @RequestBody LoginWithTokensRequestDTO dto) {
        JwtDTO jwtDTO = authService.refreshToken(dto);
        return ResponseEntity.status(HttpStatus.OK).body(jwtDTO);
    }

    // Envia un codigo de verificacion para recuperar contrasena
    @PostMapping("/recovery/request-code")
    public ResponseEntity<UsernameVerificationResponseDTO> requestRecoveryCode(@Valid @RequestBody RecoveryCodeRequestDTO dto) {
        return ResponseEntity.ok(authService.sendRecoveryCode(dto));
    }

    // Verifica el codigo de recuperacion enviado por email
    @PostMapping("/recovery/verify-code")
    public ResponseEntity<VerificationCodeResponseDTO> verifyToken(
        @Valid @RequestBody VerificationCodeRequestDTO dto
    ) {
        return ResponseEntity.ok(authService.verifyToken(dto.username(), dto.code()));
    }

    // Restablece la contrasena con un token de recuperacion valido
    @PostMapping("/recovery/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody PasswordRecoveryRequestDTO dto) {
        authService.resetPassword(dto);
        return ResponseEntity.ok().build();
    }
}
