package com.example.pawify.service;

import com.example.pawify.config.security.JwtService;
import com.example.pawify.dto.in.auth.*;
import com.example.pawify.dto.out.auth.*;
import com.example.pawify.exception.*;
import com.example.pawify.mapper.AdminMapper;
import com.example.pawify.mapper.BuyerMapper;
import com.example.pawify.model.*;
import com.example.pawify.repository.*;
import com.example.pawify.service.implement.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private BuyerRepository buyerRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AdminMapper adminMapper;

    @Mock
    private BuyerMapper buyerMapper;

    @Mock
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private CodeGenerator codeGenerator;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthServiceImpl authService;

    private RoleEntity buyerRole;
    private RoleEntity adminRole;

    @BeforeEach
    void setUp() {
        buyerRole = new RoleEntity();
        buyerRole.setId(1L);
        buyerRole.setRole(RoleEnum.BUYER);

        adminRole = new RoleEntity();
        adminRole.setId(2L);
        adminRole.setRole(RoleEnum.ADMIN);
    }

    @Nested
    @DisplayName("registerBuyer tests")
    class RegisterBuyerTests {

        @Test
        @DisplayName("should throw UsernameAlreadyUsedException when username exists")
        void shouldThrowWhenUsernameExists() {
            BuyerRegisterRequestDTO dto = new BuyerRegisterRequestDTO(
                "existinguser", "password123", "Juan", "Perez",
                "juan@email.com", "12345678"
            );
            when(userRepository.existsByUsername("existinguser")).thenReturn(true);

            assertThatThrownBy(() -> authService.registerBuyer(dto))
                .isInstanceOf(UsernameAlreadyUsedException.class)
                .hasMessage("Username is already in use");
        }

        @Test
        @DisplayName("should throw CredentialsAlreadyInUseException when dniNumber exists")
        void shouldThrowWhenDniExists() {
            BuyerRegisterRequestDTO dto = new BuyerRegisterRequestDTO(
                "newuser", "password123", "Juan", "Perez",
                "juan@email.com", "12345678"
            );
            when(userRepository.existsByUsername("newuser")).thenReturn(false);
            when(userRepository.existsByDniNumber("12345678")).thenReturn(true);

            assertThatThrownBy(() -> authService.registerBuyer(dto))
                .isInstanceOf(CredentialsAlreadyInUseException.class)
                .hasMessage("DniNumber is already in use");
        }

        @Test
        @DisplayName("should throw CredentialsAlreadyInUseException when email exists")
        void shouldThrowWhenEmailExists() {
            BuyerRegisterRequestDTO dto = new BuyerRegisterRequestDTO(
                "newuser", "password123", "Juan", "Perez",
                "existing@email.com", "12345678"
            );
            when(userRepository.existsByUsername("newuser")).thenReturn(false);
            when(userRepository.existsByDniNumber("12345678")).thenReturn(false);
            when(buyerRepository.existsByEmail("existing@email.com")).thenReturn(true);

            assertThatThrownBy(() -> authService.registerBuyer(dto))
                .isInstanceOf(CredentialsAlreadyInUseException.class)
                .hasMessage("Email is already in use");
        }

        @Test
        @DisplayName("should throw ResourceNotFoundException when BUYER role not found")
        void shouldThrowWhenRoleNotFound() {
            BuyerRegisterRequestDTO dto = new BuyerRegisterRequestDTO(
                "newuser", "password123", "Juan", "Perez",
                "juan@email.com", "12345678"
            );
            BuyerEntity buyerEntity = new BuyerEntity();
            when(userRepository.existsByUsername("newuser")).thenReturn(false);
            when(userRepository.existsByDniNumber("12345678")).thenReturn(false);
            when(buyerRepository.existsByEmail("juan@email.com")).thenReturn(false);
            when(buyerMapper.toEntity(dto)).thenReturn(buyerEntity);
            when(roleRepository.findByRole(RoleEnum.BUYER)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authService.registerBuyer(dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("role not found");
        }

        @Test
        @DisplayName("should register buyer successfully")
        void shouldRegisterBuyerSuccessfully() {
            BuyerRegisterRequestDTO dto = new BuyerRegisterRequestDTO(
                "newuser", "password123", "Juan", "Perez",
                "juan@email.com", "12345678"
            );
            BuyerEntity savedBuyer = new BuyerEntity();
            savedBuyer.setId(1L);
            savedBuyer.setUsername("newuser");
            savedBuyer.setEmail("juan@email.com");

            BuyerRegisterResponseDTO expectedResponse = new BuyerRegisterResponseDTO(
                1L, "newuser", "Juan", "Perez", "juan@email.com"
            );

            when(userRepository.existsByUsername("newuser")).thenReturn(false);
            when(userRepository.existsByDniNumber("12345678")).thenReturn(false);
            when(buyerRepository.existsByEmail("juan@email.com")).thenReturn(false);
            when(roleRepository.findByRole(RoleEnum.BUYER)).thenReturn(Optional.of(buyerRole));
            when(buyerMapper.toEntity(dto)).thenReturn(savedBuyer);
            when(bCryptPasswordEncoder.encode("password123")).thenReturn("encodedPassword");
            when(buyerRepository.save(any(BuyerEntity.class))).thenReturn(savedBuyer);
            when(buyerMapper.toResponseDTO(savedBuyer)).thenReturn(expectedResponse);

            BuyerRegisterResponseDTO result = authService.registerBuyer(dto);

            assertThat(result).isNotNull();
            assertThat(result.username()).isEqualTo("newuser");
            verify(buyerRepository).save(any(BuyerEntity.class));
        }
    }

    @Nested
    @DisplayName("login tests")
    class LoginTests {

        @Test
        @DisplayName("should throw UserInvalidCredentialsException when user not found")
        void shouldThrowWhenUserNotFound() {
            LoginRequestDTO dto = new LoginRequestDTO("nonexistent", "password123");
            when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authService.login(dto))
                .isInstanceOf(UserInvalidCredentialsException.class)
                .hasMessage("Username not found");
        }

        @Test
        @DisplayName("should throw UserInvalidCredentialsException when password is incorrect")
        void shouldThrowWhenPasswordIncorrect() {
            LoginRequestDTO dto = new LoginRequestDTO("existinguser", "wrongpassword");
            UserEntity user = new BuyerEntity();
            user.setUsername("existinguser");
            user.setPassword("encodedCorrectPassword");

            when(userRepository.findByUsername("existinguser")).thenReturn(Optional.of(user));
            when(bCryptPasswordEncoder.matches("wrongpassword", "encodedCorrectPassword")).thenReturn(false);

            assertThatThrownBy(() -> authService.login(dto))
                .isInstanceOf(UserInvalidCredentialsException.class)
                .hasMessage("incorrect password");
        }

        @Test
        @DisplayName("should return JWT tokens on successful login")
        void shouldReturnTokensOnSuccess() {
            LoginRequestDTO dto = new LoginRequestDTO("existinguser", "correctpassword");
            BuyerEntity user = new BuyerEntity();
            user.setId(1L);
            user.setUsername("existinguser");
            user.setPassword("encodedPassword");
            user.setFirstName("Juan");
            user.setLastName("Perez");
            user.setRole(buyerRole);

            when(userRepository.findByUsername("existinguser")).thenReturn(Optional.of(user));
            when(bCryptPasswordEncoder.matches("correctpassword", "encodedPassword")).thenReturn(true);
            when(jwtService.buildAccessToken(any())).thenReturn("accessToken");
            when(jwtService.buildRefreshToken("existinguser")).thenReturn("refreshToken");

            JwtDTO result = authService.login(dto);

            assertThat(result).isNotNull();
            assertThat(result.token()).isEqualTo("accessToken");
            assertThat(result.refreshToken()).isEqualTo("refreshToken");
        }
    }

    @Nested
    @DisplayName("sendRecoveryCode tests")
    class SendRecoveryCodeTests {

        @Test
        @DisplayName("should throw ResourceNotFoundException when username does not exist")
        void shouldThrowWhenUsernameNotFound() {
            RecoveryCodeRequestDTO dto = new RecoveryCodeRequestDTO("nonexistent");
            when(buyerRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authService.sendRecoveryCode(dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("username doesn't exist");
        }

        @Test
        @DisplayName("should send recovery code successfully")
        void shouldSendRecoveryCodeSuccessfully() {
            RecoveryCodeRequestDTO dto = new RecoveryCodeRequestDTO("existinguser");
            BuyerEntity buyer = new BuyerEntity();
            buyer.setId(1L);
            buyer.setUsername("existinguser");
            buyer.setEmail("user@email.com");

            when(buyerRepository.findByUsername("existinguser")).thenReturn(Optional.of(buyer));
            when(codeGenerator.generateCode(6)).thenReturn("123456");
            when(passwordResetTokenRepository.save(any())).thenReturn(new PasswordResetTokenEntity());
            doNothing().when(emailService).sendRecoveryCodeToEmail(anyString(), anyString());

            UsernameVerificationResponseDTO result = authService.sendRecoveryCode(dto);

            assertThat(result).isNotNull();
            assertThat(result.email()).isEqualTo("user@email.com");
            verify(passwordResetTokenRepository).deleteAllByUserAndUsedFalse(buyer);
            verify(emailService).sendRecoveryCodeToEmail("user@email.com", "123456");
        }
    }

    @Nested
    @DisplayName("verifyToken tests")
    class VerifyTokenTests {

        @Test
        @DisplayName("should throw InvalidRecoveryCodeException when user not found")
        void shouldThrowWhenUserNotFound() {
            when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authService.verifyToken("nonexistent", "123456"))
                .isInstanceOf(InvalidRecoveryCodeException.class)
                .hasMessage("Username not found");
        }

        @Test
        @DisplayName("should throw InvalidRecoveryCodeException when token not found")
        void shouldThrowWhenTokenNotFound() {
            UserEntity user = new BuyerEntity();
            user.setUsername("existinguser");
            when(userRepository.findByUsername("existinguser")).thenReturn(Optional.of(user));
            when(passwordResetTokenRepository.findByUserAndUsedFalse(user)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authService.verifyToken("existinguser", "123456"))
                .isInstanceOf(InvalidRecoveryCodeException.class)
                .hasMessage("Invalid recovery token");
        }

        @Test
        @DisplayName("should throw InvalidRecoveryCodeException when token expired")
        void shouldThrowWhenTokenExpired() {
            UserEntity user = new BuyerEntity();
            user.setUsername("existinguser");
            PasswordResetTokenEntity tokenEntity = new PasswordResetTokenEntity();
            tokenEntity.setExpirationDate(LocalDateTime.now().minusHours(1));

            when(userRepository.findByUsername("existinguser")).thenReturn(Optional.of(user));
            when(passwordResetTokenRepository.findByUserAndUsedFalse(user)).thenReturn(Optional.of(tokenEntity));

            assertThatThrownBy(() -> authService.verifyToken("existinguser", "123456"))
                .isInstanceOf(InvalidRecoveryCodeException.class)
                .hasMessage("Token expired");
        }

        @Test
        @DisplayName("should throw InvalidRecoveryCodeException when token is invalid")
        void shouldThrowWhenTokenInvalid() {
            UserEntity user = new BuyerEntity();
            user.setUsername("existinguser");
            PasswordResetTokenEntity tokenEntity = new PasswordResetTokenEntity();
            tokenEntity.setExpirationDate(LocalDateTime.now().plusHours(1));
            tokenEntity.setTokenHash("hashedCorrectCode");

            when(userRepository.findByUsername("existinguser")).thenReturn(Optional.of(user));
            when(passwordResetTokenRepository.findByUserAndUsedFalse(user)).thenReturn(Optional.of(tokenEntity));

            assertThatThrownBy(() -> authService.verifyToken("existinguser", "wrongCode"))
                .isInstanceOf(InvalidRecoveryCodeException.class)
                .hasMessage("Invalid Recovery Token");
        }
    }

    @Nested
    @DisplayName("resetPassword tests")
    class ResetPasswordTests {

        @Test
        @DisplayName("should throw InvalidRecoveryCodeException when user not found")
        void shouldThrowWhenUserNotFound() {
            PasswordRecoveryRequestDTO dto = new PasswordRecoveryRequestDTO(
                "nonexistent", "123456", "newPassword123"
            );
            when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authService.resetPassword(dto))
                .isInstanceOf(InvalidRecoveryCodeException.class)
                .hasMessage("Username not found");
        }

        @Test
        @DisplayName("should throw InvalidRecoveryCodeException when token expired")
        void shouldThrowWhenTokenExpired() {
            PasswordRecoveryRequestDTO dto = new PasswordRecoveryRequestDTO(
                "existinguser", "123456", "newPassword123"
            );
            UserEntity user = new BuyerEntity();
            user.setUsername("existinguser");
            PasswordResetTokenEntity tokenEntity = new PasswordResetTokenEntity();
            tokenEntity.setExpirationDate(LocalDateTime.now().minusHours(1));

            when(userRepository.findByUsername("existinguser")).thenReturn(Optional.of(user));
            when(passwordResetTokenRepository.findByUserAndUsedFalse(user)).thenReturn(Optional.of(tokenEntity));

            assertThatThrownBy(() -> authService.resetPassword(dto))
                .isInstanceOf(InvalidRecoveryCodeException.class)
                .hasMessage("Token expired");
        }
    }

    @Nested
    @DisplayName("refreshToken tests")
    class RefreshTokenTests {

        @Test
        @DisplayName("should throw UserInvalidCredentialsException when token is invalid")
        void shouldThrowWhenTokenInvalid() {
            LoginWithTokensRequestDTO dto = new LoginWithTokensRequestDTO("accessToken", "invalidRefreshToken");
            when(jwtService.isValidToken("invalidRefreshToken")).thenReturn(false);

            assertThatThrownBy(() -> authService.refreshToken(dto))
                .isInstanceOf(UserInvalidCredentialsException.class)
                .hasMessage("Invalid refresh token");
        }

        @Test
        @DisplayName("should return new JWT tokens on successful refresh")
        void shouldReturnNewTokensOnSuccess() {
            LoginWithTokensRequestDTO dto = new LoginWithTokensRequestDTO("accessToken", "validRefreshToken");
            BuyerEntity user = new BuyerEntity();
            user.setId(1L);
            user.setUsername("existinguser");
            user.setFirstName("Juan");
            user.setLastName("Perez");
            user.setRole(buyerRole);

            when(jwtService.isValidToken("validRefreshToken")).thenReturn(true);
            when(jwtService.getUsernameFromToken("validRefreshToken")).thenReturn("existinguser");
            when(userRepository.findByUsername("existinguser")).thenReturn(Optional.of(user));
            when(jwtService.buildAccessToken(any())).thenReturn("newAccessToken");
            when(jwtService.buildRefreshToken("existinguser")).thenReturn("newRefreshToken");

            JwtDTO result = authService.refreshToken(dto);

            assertThat(result).isNotNull();
            assertThat(result.token()).isEqualTo("newAccessToken");
            assertThat(result.refreshToken()).isEqualTo("newRefreshToken");
        }
    }
}
