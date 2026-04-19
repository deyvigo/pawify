package com.example.pawify.service.implement;

import com.example.pawify.dto.in.auth.AdminRegisterRequestDTO;
import com.example.pawify.dto.in.auth.BuyerRegisterRequestDTO;
import com.example.pawify.dto.out.auth.AdminRegisterResponseDTO;
import com.example.pawify.dto.out.auth.BuyerRegisterResponseDTO;
import com.example.pawify.exception.ResourceNotFoundException;
import com.example.pawify.exception.UsernameAlreadyUsedException;
import com.example.pawify.mapper.AdminMapper;
import com.example.pawify.mapper.BuyerMapper;
import com.example.pawify.model.AdminEntity;
import com.example.pawify.model.BuyerEntity;
import com.example.pawify.model.RoleEntity;
import com.example.pawify.model.RoleEnum;
import com.example.pawify.repository.AdminRepository;
import com.example.pawify.repository.BuyerRepository;
import com.example.pawify.repository.RoleRepository;
import com.example.pawify.repository.UserRepository;
import com.example.pawify.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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
}
