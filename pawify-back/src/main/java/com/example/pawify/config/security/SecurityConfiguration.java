package com.example.pawify.config.security;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Spring Security configuration for the Pawify application.
 *
 * <p>Defines the security filter chain with the following characteristics:</p>
 * <ul>
 *   <li>Stateless session management (no HTTP sessions)</li>
 *   <li>CSRF protection disabled for REST API usage</li>
 *   <li>CORS configured for local development origins</li>
 *   <li>Public endpoints: auth, error, swagger, and helloworld routes</li>
 *   <li>BUYER role required for card, address, buyer, and review endpoints</li>
 *   <li>ADMIN role required for admin endpoints</li>
 *   <li>All other endpoints require authentication</li>
 *   <li>JWT-based authentication via {@link JwtAuthenticationFilter}</li>
 *   <li>Custom authentication entry point for 401 responses</li>
 * </ul>
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@AllArgsConstructor
public class SecurityConfiguration {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    /**
     * Configures the HTTP security filter chain.
     *
     * <p>Sets up CORS, disables CSRF, configures stateless sessions,
     * defines URL-based authorization rules, adds the JWT authentication
     * filter before the username/password filter, and registers a
     * custom authentication entry point.</p>
     *
     * @param http the {@link HttpSecurity} to configure
     * @return the configured {@link SecurityFilterChain}
     * @throws Exception if any configuration error occurs
     */
    @Bean
    public SecurityFilterChain customSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(corsCustomizer -> corsCustomizer.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(requests -> requests
                .requestMatchers(
                    "/auth/**",
                    "/error",
                    "/swagger-ui.html",
                    "/swagger-ui/**",
                    "/api-docs",
                    "/helloworld"
                ).permitAll()
                .requestMatchers(request -> "OPTIONS".equalsIgnoreCase(request.getMethod())).permitAll()
                .requestMatchers(
                    "/card/**",
                    "/address/**",
                    "/buyer/**",
                    "/review/**"
                ).hasRole("BUYER")
                .requestMatchers(
                    "/admin/**"
                ).hasRole("ADMIN")
                .anyRequest().authenticated()
            ).exceptionHandling(ex -> ex.authenticationEntryPoint(customAuthenticationEntryPoint))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    /**
     * Configures the CORS (Cross-Origin Resource Sharing) settings.
     *
     * <p>Allows requests from localhost origins on any port, permits
     * standard HTTP methods and headers, enables credentials, and
     * exposes the Authorization header.</p>
     *
     * @return the configured {@link CorsConfigurationSource}
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(List.of("http://localhost:*", "http://127.0.0.1:*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
