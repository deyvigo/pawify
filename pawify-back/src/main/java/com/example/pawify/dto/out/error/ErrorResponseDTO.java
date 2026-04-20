package com.example.pawify.dto.out.error;

import lombok.Builder;
import org.springframework.http.HttpStatus;

import java.util.Map;

@Builder
public record ErrorResponseDTO(
    int statusCode, String message, String code, Map<String, Object> details
) {
    public static ErrorResponseDTO of(
        HttpStatus status,
        String code,
        String message
    ) {
        return ErrorResponseDTO.builder()
            .statusCode(status.value()).code(code).message(message).build();
    }

    public static ErrorResponseDTO of(
        HttpStatus status,
        String code,
        String message,
        Map<String, Object> details
    ) {
        return ErrorResponseDTO.builder()
            .statusCode(status.value()).code(code).message(message).details(details).build();
    }
}
