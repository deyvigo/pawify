package com.example.pawify.advice;

import com.example.pawify.dto.out.error.ErrorResponseDTO;
import com.example.pawify.exception.ResourceNotFoundException;
import com.example.pawify.exception.UsernameAlreadyUsedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, Object> errors = ex.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.toMap(
                fe -> toSnakeCase(fe.getField()),
                fe -> Objects.requireNonNullElse(fe.getDefaultMessage(), "Blank error message"),
                (a, b) -> a
            ));

        return ResponseEntity.badRequest()
            .body(ErrorResponseDTO.of(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", "Validation error", errors));
    }

    @ExceptionHandler(UsernameAlreadyUsedException.class)
    public ResponseEntity<ErrorResponseDTO> handleUsernameTaken(UsernameAlreadyUsedException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(ErrorResponseDTO.of(HttpStatus.CONFLICT, "USERNAME_TAKEN", ex.getMessage()));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ErrorResponseDTO.of(HttpStatus.NOT_FOUND, "RESOURCE_NOT_FOUND", ex.getMessage()));
    }

    private static String toSnakeCase(String field) {
        return field.replaceAll("([a-z])([A-Z]+)", "$1_$2").toLowerCase();
    }
}
