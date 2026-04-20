package com.example.pawify.service;

import com.example.pawify.dto.in.auth.AdminRegisterRequestDTO;
import com.example.pawify.dto.in.auth.BuyerRegisterRequestDTO;
import com.example.pawify.dto.in.auth.LoginRequestDTO;
import com.example.pawify.dto.in.auth.LoginWithTokensRequestDTO;
import com.example.pawify.dto.out.auth.AdminRegisterResponseDTO;
import com.example.pawify.dto.out.auth.BuyerRegisterResponseDTO;
import com.example.pawify.dto.out.auth.JwtDTO;

public interface AuthService {
    AdminRegisterResponseDTO registerAdmin(AdminRegisterRequestDTO adminRegisterRequestDTO);
    BuyerRegisterResponseDTO registerBuyer(BuyerRegisterRequestDTO buyerRegisterRequestDTO);
    JwtDTO login(LoginRequestDTO loginRequestDTO);
    JwtDTO refreshToken(LoginWithTokensRequestDTO refreshToken);
}
