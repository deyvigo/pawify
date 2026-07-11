package com.example.pawify.config.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Map;

/**
 * Custom authentication entry point that returns a JSON 401 Unauthorized
 * response when an unauthenticated request is made to a protected endpoint.
 *
 * <p>Replaces the default Spring Security redirect-based entry point
 * with a JSON response suitable for REST API clients.</p>
 */
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    /**
     * Handles unauthorized access attempts by writing a JSON response
     * with HTTP status 401 and an "Unauthorized" message.
     *
     * @param req the HTTP servlet request that triggered the entry point
     * @param res the HTTP servlet response to write to
     * @param ae the authentication exception that was thrown
     * @throws IOException if an I/O error occurs while writing the response
     */
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
