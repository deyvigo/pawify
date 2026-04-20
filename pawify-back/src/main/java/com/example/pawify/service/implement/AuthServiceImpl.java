package com.example.pawify.service.implement;

import com.example.pawify.config.security.JwtService;
import com.example.pawify.dto.in.auth.AdminRegisterRequestDTO;
import com.example.pawify.dto.in.auth.BuyerRegisterRequestDTO;
import com.example.pawify.dto.in.auth.LoginRequestDTO;
import com.example.pawify.dto.in.auth.LoginWithTokensRequestDTO;
import com.example.pawify.dto.out.auth.AdminRegisterResponseDTO;
import com.example.pawify.dto.out.auth.BuyerRegisterResponseDTO;
import com.example.pawify.dto.out.auth.JwtDTO;
import com.example.pawify.exception.ResourceNotFoundException;
import com.example.pawify.exception.UserInvalidCredentialsException;
import com.example.pawify.exception.UsernameAlreadyUsedException;
import com.example.pawify.mapper.AdminMapper;
import com.example.pawify.mapper.BuyerMapper;
import com.example.pawify.model.*;
import com.example.pawify.repository.AdminRepository;
import com.example.pawify.repository.BuyerRepository;
import com.example.pawify.repository.RoleRepository;
import com.example.pawify.repository.UserRepository;
import com.example.pawify.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AdminRepository adminRepository;
    private final BuyerRepository buyerRepository;
    private final UserRepository userRepository;
    private final AdminMapper adminMapper;
    private final BuyerMapper buyerMapper;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;

    @Override
    public AdminRegisterResponseDTO registerAdmin(AdminRegisterRequestDTO dto) {
        if (userRepository.existsByUsername(dto.username())) throw new UsernameAlreadyUsedException("Username is already in use");

        AdminEntity adminEntity = adminMapper.toEntity(dto);
        adminEntity.setPassword(bCryptPasswordEncoder.encode(dto.password()));

        RoleEntity roleEntity = roleRepository.findByRole(RoleEnum.ADMIN)
            .orElseThrow(() -> new ResourceNotFoundException("role not found"));
        adminEntity.setRole(roleEntity);

        AdminEntity savedAdminEntity = adminRepository.save(adminEntity);
        return adminMapper.toResponseDTO(savedAdminEntity);
    }

    @Override
    public BuyerRegisterResponseDTO registerBuyer(BuyerRegisterRequestDTO dto) {
        if (userRepository.existsByUsername(dto.username()))  throw new UsernameAlreadyUsedException("Username is already in use");

        BuyerEntity buyerEntity = buyerMapper.toEntity(dto);
        buyerEntity.setPassword(bCryptPasswordEncoder.encode(dto.password()));

        RoleEntity roleEntity = roleRepository.findByRole(RoleEnum.BUYER)
            .orElseThrow(() -> new ResourceNotFoundException("role not found"));
        buyerEntity.setRole(roleEntity);

        BuyerEntity savedBuyerEntity = buyerRepository.save(buyerEntity);
        return buyerMapper.toResponseDTO(savedBuyerEntity);
    }

    @Override
    public JwtDTO login(LoginRequestDTO dto) {
        UserEntity userEntity = userRepository.findByUsername(dto.username())
            .orElseThrow(() -> new UserInvalidCredentialsException("Username not found"));

        if (!bCryptPasswordEncoder.matches(dto.password(), userEntity.getPassword())) {
            throw new UserInvalidCredentialsException("incorrect password");
        }

        Map<String, Object> claims = buildClaimsFromUser(userEntity);

        String token = jwtService.buildAccessToken(claims);
        String refreshToken = jwtService.buildRefreshToken(userEntity.getUsername());
        return new JwtDTO(token, refreshToken);
    }

    @Override
    public JwtDTO refreshToken(LoginWithTokensRequestDTO dto) {
        if (!jwtService.isValidToken(dto.refreshToken())) throw new UserInvalidCredentialsException("Invalid refresh token");

        String username = jwtService.getUsernameFromToken(dto.refreshToken());
        UserEntity userEntity = userRepository.findByUsername(username)
            .orElseThrow(() -> new UserInvalidCredentialsException("Username not found"));

        Map<String, Object> claims = buildClaimsFromUser(userEntity);

        String token = jwtService.buildAccessToken(claims);
        String refreshToken = jwtService.buildRefreshToken(userEntity.getUsername());
        return new JwtDTO(token, refreshToken);
    }

    private Map<String, Object> buildClaimsFromUser(UserEntity userEntity) {
        return Map.of(
            "id", userEntity.getId(),
            "username", userEntity.getUsername(),
            "role", userEntity.getRole().getRole(),
            "first_name", userEntity.getFirstName(),
            "last_name", userEntity.getLastName()
        );
    }
}
