package com.example.pawify.service;

import com.example.pawify.dto.in.auth.*;
import com.example.pawify.dto.out.auth.*;

// Servicio de autenticacion: registro, login, tokens y recuperacion
public interface AuthService {

    // Registra un nuevo administrador y retorna su JWT
    AdminRegisterResponseDTO registerAdmin(AdminRegisterRequestDTO adminRegisterRequestDTO);

    // Registra un nuevo comprador y retorna su JWT
    BuyerRegisterResponseDTO registerBuyer(BuyerRegisterRequestDTO buyerRegisterRequestDTO);

    // Autentica un usuario y retorna access y refresh tokens
    JwtDTO login(LoginRequestDTO loginRequestDTO);

    // Renueva tokens usando un refresh token valido
    JwtDTO refreshToken(LoginWithTokensRequestDTO refreshToken);

    // Envia un codigo de recuperacion al email del comprador
    UsernameVerificationResponseDTO sendRecoveryCode(RecoveryCodeRequestDTO dto);

    // Verifica un codigo de recuperacion para un usuario dado
    VerificationCodeResponseDTO verifyToken(String username, String token);

    // Resetea la contrasena usando un codigo de recuperacion valido
    void resetPassword(PasswordRecoveryRequestDTO dto);
}
