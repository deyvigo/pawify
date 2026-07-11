package com.example.pawify.integration;

import com.example.pawify.dto.in.auth.BuyerRegisterRequestDTO;
import com.example.pawify.dto.in.auth.LoginRequestDTO;
import com.example.pawify.dto.in.auth.LoginWithTokensRequestDTO;
import com.example.pawify.dto.in.auth.RecoveryCodeRequestDTO;
import com.example.pawify.model.BuyerEntity;
import com.example.pawify.model.AdminEntity;
import com.example.pawify.model.RoleEnum;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AuthIntegrationTest extends BaseIntegrationTest {

    @BeforeEach
    void setUp() {
        createAndSaveBuyer(
            "buyer_test", "password123", "Test", "Buyer",
            "buyer@test.com", "87654321"
        );
    }

    @Nested
    @DisplayName("CP-001 | Registro de comprador exitoso")
    class CP001 {

        @Test
        @DisplayName("debe registrar un nuevo comprador con 201 CREATED")
        void registerBuyerSuccessfully() throws Exception {
            BuyerRegisterRequestDTO dto = new BuyerRegisterRequestDTO(
                "newbuyer_test", "newbuyer123", "Nuevo", "Comprador",
                "newbuyer@test.com", "22222222"
            );

            mockMvc.perform(post("/auth/register/buyer")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("newbuyer_test"))
                .andExpect(jsonPath("$.first_name").value("Nuevo"))
                .andExpect(jsonPath("$.last_name").value("Comprador"))
                .andExpect(jsonPath("$.email").value("newbuyer@test.com"));
        }
    }

    @Nested
    @DisplayName("CP-002 | Rechazar username duplicado")
    class CP002 {

        @Test
        @DisplayName("debe rechazar registro con username duplicado 409 CONFLICT")
        void rejectDuplicateUsername() throws Exception {
            BuyerRegisterRequestDTO dto = new BuyerRegisterRequestDTO(
                "buyer_test", "password123", "Otro", "Usuario",
                "otro@test.com", "11111111"
            );

            mockMvc.perform(post("/auth/register/buyer")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(dto)))
                .andExpect(status().isConflict());
        }
    }

    @Nested
    @DisplayName("CP-003 | Rechazar DNI duplicado")
    class CP003 {

        @Test
        @DisplayName("debe rechazar registro con DNI duplicado 409 CONFLICT")
        void rejectDuplicateDni() throws Exception {
            BuyerRegisterRequestDTO dto = new BuyerRegisterRequestDTO(
                "unique_user", "password123", "Otro", "Usuario",
                "otro@test.com", "87654321"
            );

            mockMvc.perform(post("/auth/register/buyer")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(dto)))
                .andExpect(status().isConflict());
        }
    }

    @Nested
    @DisplayName("CP-004 | Rechazar campos vacios")
    class CP004 {

        @Test
        @DisplayName("debe rechazar registro con campos vacios 400 BAD_REQUEST")
        void rejectEmptyFields() throws Exception {
            String emptyBody = """
                {
                    "username": "",
                    "password": "",
                    "first_name": "",
                    "last_name": "",
                    "email": "",
                    "dni_number": ""
                }
                """;

            mockMvc.perform(post("/auth/register/buyer")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(emptyBody))
                .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("CP-005 | Login exitoso retorna tokens")
    class CP005 {

        @Test
        @DisplayName("debe retornar token y refreshToken con 200 OK")
        void loginSuccessfully() throws Exception {
            LoginRequestDTO dto = new LoginRequestDTO("buyer_test", "password123");

            mockMvc.perform(post("/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.refresh_token").isNotEmpty());
        }
    }

    @Nested
    @DisplayName("CP-006 | Login con contrasena incorrecta")
    class CP006 {

        @Test
        @DisplayName("debe retornar 401 UNAUTHORIZED con contrasena incorrecta")
        void loginWithWrongPassword() throws Exception {
            LoginRequestDTO dto = new LoginRequestDTO("buyer_test", "wrongpass");

            mockMvc.perform(post("/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(dto)))
                .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    @DisplayName("CP-007 | Login con usuario inexistente")
    class CP007 {

        @Test
        @DisplayName("debe retornar 401 UNAUTHORIZED con usuario inexistente")
        void loginWithNonExistentUser() throws Exception {
            LoginRequestDTO dto = new LoginRequestDTO("noexiste", "password123");

            mockMvc.perform(post("/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(dto)))
                .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    @DisplayName("CP-008 | Refresh token valido")
    class CP008 {

        @Test
        @DisplayName("debe retornar nuevos tokens con 200 OK")
        void refreshTokenSuccessfully() throws Exception {
            String refreshToken = generateRefreshToken("buyer_test");
            LoginWithTokensRequestDTO dto = new LoginWithTokensRequestDTO("old_token", refreshToken);

            mockMvc.perform(post("/auth/refresh")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.refresh_token").isNotEmpty());
        }
    }

    @Nested
    @DisplayName("CP-009 | Refresh token invalido")
    class CP009 {

        @Test
        @DisplayName("debe retornar 401 UNAUTHORIZED con refresh token invalido")
        void refreshTokenInvalid() throws Exception {
            javax.crypto.SecretKey wrongKey = io.jsonwebtoken.security.Keys.secretKeyFor(
                io.jsonwebtoken.SignatureAlgorithm.HS256
            );
            String badToken = io.jsonwebtoken.Jwts.builder()
                .claims(java.util.Map.of("username", "test"))
                .signWith(wrongKey)
                .compact();
            LoginWithTokensRequestDTO dto = new LoginWithTokensRequestDTO("token", badToken);

            mockMvc.perform(post("/auth/refresh")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(dto)))
                .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    @DisplayName("CP-010 | Solicitar codigo de recuperacion")
    class CP010 {

        @Test
        @DisplayName("debe retornar email del usuario con 200 OK")
        void requestRecoveryCode() throws Exception {
            RecoveryCodeRequestDTO dto = new RecoveryCodeRequestDTO("buyer_test");

            mockMvc.perform(post("/auth/recovery/request-code")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("buyer@test.com"));
        }
    }

    @Nested
    @DisplayName("CP-011 | Recuperacion con usuario inexistente")
    class CP011 {

        @Test
        @DisplayName("debe retornar 404 NOT_FOUND con usuario inexistente")
        void recoveryNonExistentUser() throws Exception {
            RecoveryCodeRequestDTO dto = new RecoveryCodeRequestDTO("noexiste");

            mockMvc.perform(post("/auth/recovery/request-code")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(dto)))
                .andExpect(status().isNotFound());
        }
    }

    @Nested
    @DisplayName("CP-012 | Buyer no accede a endpoint admin")
    class CP012 {

        @Test
        @DisplayName("debe retornar 403 FORBIDDEN al acceder a /admin/buyers con token de buyer")
        void buyerCannotAccessAdminEndpoint() throws Exception {
            String token = generateToken("buyer_test", RoleEnum.BUYER);

            mockMvc.perform(get("/admin/buyers")
                    .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
        }
    }

    @Nested
    @DisplayName("CP-013 | Admin no accede a endpoint buyer")
    class CP013 {

        @Test
        @DisplayName("debe retornar 403 FORBIDDEN al acceder a /order con token de admin")
        void adminCannotAccessBuyerEndpoint() throws Exception {
            AdminEntity admin = createAndSaveAdmin(
                "admin_test", "adminpass123", "Admin", "Test", "12345678"
            );
            String token = generateToken("admin_test", RoleEnum.ADMIN);

            mockMvc.perform(get("/order")
                    .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
        }
    }

    @Nested
    @DisplayName("CP-014 | Endpoint protegido sin token")
    class CP014 {

        @Test
        @DisplayName("debe retornar 401 UNAUTHORIZED al acceder sin token")
        void accessProtectedEndpointWithoutToken() throws Exception {
            mockMvc.perform(post("/user/password")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"new_password\":\"test1234\",\"confirm_new_password\":\"test1234\",\"current_password\":\"old12345\"}"))
                .andExpect(status().isUnauthorized());
        }
    }
}
