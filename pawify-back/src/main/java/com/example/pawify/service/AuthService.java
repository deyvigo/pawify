package com.example.pawify.service;

import com.example.pawify.dto.in.auth.*;
import com.example.pawify.dto.out.auth.AdminRegisterResponseDTO;
import com.example.pawify.dto.out.auth.BuyerRegisterResponseDTO;
import com.example.pawify.dto.out.auth.JwtDTO;

public interface AuthService {
    AdminRegisterResponseDTO registerAdmin(AdminRegisterRequestDTO adminRegisterRequestDTO);
    BuyerRegisterResponseDTO registerBuyer(BuyerRegisterRequestDTO buyerRegisterRequestDTO);
    JwtDTO login(LoginRequestDTO loginRequestDTO);
    JwtDTO refreshToken(LoginWithTokensRequestDTO refreshToken);
    void sendRecoveryCode(RecoveryCodeRequestDTO dto);
    void resetPassword(PasswordRecoveryRequestDTO dto);
}
