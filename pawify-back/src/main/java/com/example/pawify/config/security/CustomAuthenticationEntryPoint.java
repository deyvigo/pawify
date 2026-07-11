package com.example.pawify.config.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Map;

// Entry point que retorna JSON 401 cuando no hay autenticacion
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    // Escribe una respuesta JSON con status 401 y mensaje "Unauthorized"
    @Override
    public void commence(
        HttpServletRequest req,
        HttpServletResponse res,
        AuthenticationException ae
    ) throws IOException {
        res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        res.setContentType("application/json");

        Map<String, Object> body = Map.of(
            "status", 401,
            "message", "Unauthorized"
        );

        new ObjectMapper().writeValue(res.getWriter(), body);
    }
}
