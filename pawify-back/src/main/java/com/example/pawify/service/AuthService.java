package com.example.pawify.service;

import com.example.pawify.dto.in.auth.AdminRegisterRequestDTO;
import com.example.pawify.dto.in.auth.BuyerRegisterRequestDTO;
import com.example.pawify.dto.out.auth.AdminRegisterResponseDTO;
import com.example.pawify.dto.out.auth.BuyerRegisterResponseDTO;

public interface AuthService {
    AdminRegisterResponseDTO registerAdmin(AdminRegisterRequestDTO adminRegisterRequestDTO);
    BuyerRegisterResponseDTO registerBuyer(BuyerRegisterRequestDTO buyerRegisterRequestDTO);
}
