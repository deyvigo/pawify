package com.example.pawify.controller;

import com.example.pawify.dto.in.auth.AdminRegisterRequestDTO;
import com.example.pawify.dto.in.auth.BuyerRegisterRequestDTO;
import com.example.pawify.dto.in.auth.LoginRequestDTO;
import com.example.pawify.dto.in.auth.LoginWithTokensRequestDTO;
import com.example.pawify.dto.out.auth.AdminRegisterResponseDTO;
import com.example.pawify.dto.out.auth.BuyerRegisterResponseDTO;
import com.example.pawify.dto.out.auth.JwtDTO;
import com.example.pawify.service.AuthService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/auth")
@AllArgsConstructor
public class AuthController {
    private AuthService authService;

    @PostMapping("/register/admin")
    public ResponseEntity<AdminRegisterResponseDTO> registerAdmin(@Valid @RequestBody AdminRegisterRequestDTO dto) {
        AdminRegisterResponseDTO adminDTO = authService.registerAdmin(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(adminDTO);
    }

    @PostMapping("/register/buyer")
    public ResponseEntity<BuyerRegisterResponseDTO> registerBuyer(@Valid @RequestBody BuyerRegisterRequestDTO dto) {
        BuyerRegisterResponseDTO buyerDTO = authService.registerBuyer(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(buyerDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        JwtDTO jwtDTO = authService.login(dto);
        return ResponseEntity.status(HttpStatus.OK).body(jwtDTO);
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtDTO> refreshToken(@Valid @RequestBody LoginWithTokensRequestDTO dto) {
        JwtDTO jwtDTO = authService.refreshToken(dto);
        return ResponseEntity.status(HttpStatus.OK).body(jwtDTO);
    }
}
