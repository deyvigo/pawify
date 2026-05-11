package com.example.pawify.service;

import com.example.pawify.dto.in.auth.*;
import com.example.pawify.dto.out.auth.*;

public interface AuthService {
    AdminRegisterResponseDTO registerAdmin(AdminRegisterRequestDTO adminRegisterRequestDTO);
    BuyerRegisterResponseDTO registerBuyer(BuyerRegisterRequestDTO buyerRegisterRequestDTO);
    JwtDTO login(LoginRequestDTO loginRequestDTO);
    JwtDTO refreshToken(LoginWithTokensRequestDTO refreshToken);
    UsernameVerificationResponseDTO sendRecoveryCode(RecoveryCodeRequestDTO dto);
    VerificationCodeResponseDTO verifyToken(String username, String token);
    void resetPassword(PasswordRecoveryRequestDTO dto);
}
