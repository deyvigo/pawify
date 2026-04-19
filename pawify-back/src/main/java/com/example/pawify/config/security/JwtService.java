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

@Service
public class JwtService {
    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @Value("${security.jwt.expiration-time}")
    private Long expirationTime;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }

    public String buildToken(Map<String, Object> claims) {
        return Jwts.builder()
            .claims(claims)
            .signWith(getSigningKey())
            .expiration(new Date(System.currentTimeMillis() + expirationTime))
            .compact();
    }

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

    public String getUsernameFromToken(String token) {
        Map<String, Object> claims = extractPayload(token);
        return claims != null ? (String) claims.get("username") : null;
    }
}
