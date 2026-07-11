package com.example.pawify.config.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

// Servicio JWT: generacion, parseo y validacion de tokens
@Service
public class JwtService {
    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @Value("${security.jwt.expiration-time}")
    private Long expirationTime;

    // Construye la clave HMAC-SHA desde la clave Base64 configurada
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }

    // Construye un access token con los claims indicados y expiracion configurada
    public String buildAccessToken(Map<String, Object> claims) {
        return Jwts.builder()
            .claims(claims)
            .signWith(getSigningKey())
            .expiration(new Date(System.currentTimeMillis() + expirationTime))
            .compact();
    }

    // Construye un refresh token con expiracion de 7 dias
    public String buildRefreshToken(String username) {
        return Jwts.builder()
            .claims(Map.of("username", username))
            .expiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 7)) // 7 days
            .signWith(getSigningKey())
            .compact();
    }

    // Extrae y valida el payload de claims de un JWT, retorna null si la firma es invalida
    public Map<String, Object> extractPayload(String token) {
        try {
            return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        } catch (SignatureException e) {
            return null;
        }
    }

    // Valida la firma y estructura de un JWT
    public boolean isValidToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (SignatureException se) {
            return false;
        }
    }

    // Extrae el claim username de un JWT
    public String getUsernameFromToken(String token) {
        Map<String, Object> claims = extractPayload(token);
        return claims != null ? (String) claims.get("username") : null;
    }
}
