package com.example.pawify.service.implement;

import com.example.pawify.config.security.JwtService;
import com.example.pawify.dto.in.auth.*;
import com.example.pawify.dto.out.auth.*;
import com.example.pawify.exception.*;
import com.example.pawify.mapper.AdminMapper;
import com.example.pawify.mapper.BuyerMapper;
import com.example.pawify.model.*;
import com.example.pawify.repository.*;
import com.example.pawify.service.AuthService;
import com.example.pawify.service.CodeGenerator;
import com.example.pawify.service.EmailService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

// Implementacion del servicio de autenticacion
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
    private final CodeGenerator codeGenerator;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    // Registra un administrador validando unicidad de username y DNI
    @Override
    public AdminRegisterResponseDTO registerAdmin(AdminRegisterRequestDTO dto) {
        if (userRepository.existsByUsername(dto.username())) throw new UsernameAlreadyUsedException("Username is already in use");
        if (userRepository.existsByDniNumber(dto.dniNumber())) throw new CredentialsAlreadyInUseException("DniNumber is already in use");

        AdminEntity adminEntity = adminMapper.toEntity(dto);
        adminEntity.setPassword(bCryptPasswordEncoder.encode(dto.password()));

        RoleEntity roleEntity = roleRepository.findByRole(RoleEnum.ADMIN)
            .orElseThrow(() -> new ResourceNotFoundException("role not found"));
        adminEntity.setRole(roleEntity);

        AdminEntity savedAdminEntity = adminRepository.save(adminEntity);
        return adminMapper.toResponseDTO(savedAdminEntity);
    }

    // Registra un comprador validando unicidad de username, DNI y email
    @Override
    public BuyerRegisterResponseDTO registerBuyer(BuyerRegisterRequestDTO dto) {
        if (userRepository.existsByUsername(dto.username()))  throw new UsernameAlreadyUsedException("Username is already in use");
        if (userRepository.existsByDniNumber(dto.dniNumber())) throw new CredentialsAlreadyInUseException("DniNumber is already in use");
        if (buyerRepository.existsByEmail(dto.email())) throw new CredentialsAlreadyInUseException("Email is already in use");

        BuyerEntity buyerEntity = buyerMapper.toEntity(dto);
        buyerEntity.setPassword(bCryptPasswordEncoder.encode(dto.password()));

        RoleEntity roleEntity = roleRepository.findByRole(RoleEnum.BUYER)
            .orElseThrow(() -> new ResourceNotFoundException("role not found"));
        buyerEntity.setRole(roleEntity);

        BuyerEntity savedBuyerEntity = buyerRepository.save(buyerEntity);
        return buyerMapper.toResponseDTO(savedBuyerEntity);
    }

    // Valida credenciales y retorna access y refresh tokens
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

    // Valida el refresh token y genera nuevos tokens
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

    // Genera un codigo de recuperacion y lo envia por email
    @Override
    @Transactional
    public UsernameVerificationResponseDTO sendRecoveryCode(RecoveryCodeRequestDTO dto) {
        BuyerEntity buyer = buyerRepository.findByUsername(dto.username()).orElse(null);

        if (buyer == null) {
            throw new ResourceNotFoundException("username doesn't exist");
        };

        passwordResetTokenRepository.deleteAllByUserAndUsedFalse(buyer);

        String token = codeGenerator.generateCode(6);
        String tokenHashed = passwordEncoder.encode(token);

        PasswordResetTokenEntity passwordResetTokenEntity = new PasswordResetTokenEntity();
        passwordResetTokenEntity.setTokenHash(tokenHashed);
        passwordResetTokenEntity.setUser(buyer);
        passwordResetTokenEntity.setExpirationDate(LocalDateTime.now().plusHours(1));
        passwordResetTokenRepository.save(passwordResetTokenEntity);

        try {
            emailService.sendRecoveryCodeToEmail(buyer.getEmail(), token);
            return new UsernameVerificationResponseDTO(
                buyer.getEmail()
            );
        } catch (Exception e) {
            return null;
        }
    }

    // Verifica que el codigo de recuperacion sea valido y no este expirado
    @Override
    public VerificationCodeResponseDTO verifyToken(String username, String token) {
        UserEntity userEntity = userRepository.findByUsername(username)
            .orElseThrow(() -> new InvalidRecoveryCodeException("Username not found"));

        PasswordResetTokenEntity passwordResetTokenEntity = passwordResetTokenRepository.findByUserAndUsedFalse(userEntity)
            .orElseThrow(() -> new InvalidRecoveryCodeException("Invalid recovery token"));

        if (passwordResetTokenEntity.getExpirationDate().isBefore(LocalDateTime.now())) {
            throw new InvalidRecoveryCodeException("Token expired");
        }

        if (!passwordEncoder.matches(token, passwordResetTokenEntity.getTokenHash())) {
            throw new InvalidRecoveryCodeException("Invalid Recovery Token");
        }

        return new VerificationCodeResponseDTO(
            true
        );
    }

    // Resetea la contrasena y marca el token como usado
    @Override
    @Transactional
    public void resetPassword(PasswordRecoveryRequestDTO dto) {
        UserEntity user = userRepository.findByUsername(dto.username())
            .orElseThrow(()  -> new InvalidRecoveryCodeException("Username not found"));

        PasswordResetTokenEntity passwordResetTokenEntity = passwordResetTokenRepository.findByUserAndUsedFalse(user)
            .orElseThrow(() -> new InvalidRecoveryCodeException("Invalid recovery token"));

        if (passwordResetTokenEntity.getExpirationDate().isBefore(LocalDateTime.now())) {
            throw new InvalidRecoveryCodeException("Token expired");
        }

        if (!passwordEncoder.matches(dto.code(), passwordResetTokenEntity.getTokenHash())) {
            throw new InvalidRecoveryCodeException("Invalid recovery token");
        }

        user.setPassword(passwordEncoder.encode(dto.newPassword()));
        userRepository.save(user);

        passwordResetTokenEntity.setUsed(true);
        passwordResetTokenRepository.save(passwordResetTokenEntity);
    }

    // Construye claims con datos del usuario para el JWT
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
