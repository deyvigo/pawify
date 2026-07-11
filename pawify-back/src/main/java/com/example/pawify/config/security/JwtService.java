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

/**
 * Service responsible for JWT token operations including generation,
 * parsing, and validation.
 *
 * <p>Uses HMAC-SHA signing with a Base64-encoded secret key configured
 * via {@code security.jwt.secret-key}. Access tokens use a configurable
 * expiration time, while refresh tokens have a fixed 7-day expiration.</p>
 *
 * <p>Requires the following configuration properties:</p>
 * <ul>
 *   <li>{@code security.jwt.secret-key} - Base64-encoded HMAC signing key</li>
 *   <li>{@code security.jwt.expiration-time} - Access token expiration in milliseconds</li>
 * </ul>
 */
@Service
public class JwtService {
    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @Value("${security.jwt.expiration-time}")
    private Long expirationTime;

    /**
     * Builds the HMAC-SHA signing key from the configured Base64-encoded secret.
     *
     * @return the {@link SecretKey} used for signing and verifying JWT tokens
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }

    /**
     * Builds a signed access token with the provided claims and configured expiration.
     *
     * @param claims the claims to include in the token payload
     * @return the compact serialized JWT string
     */
    public String buildAccessToken(Map<String, Object> claims) {
        return Jwts.builder()
            .claims(claims)
            .signWith(getSigningKey())
            .expiration(new Date(System.currentTimeMillis() + expirationTime))
            .compact();
    }

    /**
     * Builds a signed refresh token with a 7-day expiration containing the username claim.
     *
     * @param username the username to include in the token payload
     * @return the compact serialized JWT string
     */
    public String buildRefreshToken(String username) {
        return Jwts.builder()
            .claims(Map.of("username", username))
            .expiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 7)) // 7 days
            .signWith(getSigningKey())
            .compact();
    }

    /**
     * Extracts and verifies the claims payload from a JWT token.
     *
     * @param token the JWT token to parse
     * @return the claims map if the token is valid, or null if the signature is invalid
     */
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

    /**
     * Validates the signature and structural integrity of a JWT token.
     *
     * @param token the JWT token to validate
     * @return true if the token is valid, false if the signature is invalid
     */
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

    /**
     * Extracts the username claim from a JWT token.
     *
     * @param token the JWT token from which to extract the username
     * @return the username string, or null if the token is invalid or the claim is missing
     */
    public String getUsernameFromToken(String token) {
        Map<String, Object> claims = extractPayload(token);
        return claims != null ? (String) claims.get("username") : null;
    }
}
