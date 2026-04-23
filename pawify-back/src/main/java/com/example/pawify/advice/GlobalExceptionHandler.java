package com.example.pawify.advice;

import com.example.pawify.dto.out.error.ErrorResponseDTO;
import com.example.pawify.exception.*;
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

    @ExceptionHandler(UserInvalidCredentialsException.class)
    public ResponseEntity<ErrorResponseDTO> handleUserInvalidCredentials(UserInvalidCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(ErrorResponseDTO.of(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", ex.getMessage()));
    }

    @ExceptionHandler(ImagesNotProvidedException.class)
    public ResponseEntity<ErrorResponseDTO> handleImagesNotProvided(ImagesNotProvidedException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ErrorResponseDTO.of(HttpStatus.BAD_REQUEST, "IMAGES_NOT_PROVIDED", ex.getMessage()));
    }

    @ExceptionHandler(UnauthorizedRequestException.class) // its authenticated but not have roles required
    public ResponseEntity<ErrorResponseDTO> handleUnauthorizedRequest(UnauthorizedRequestException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(ErrorResponseDTO.of(HttpStatus.FORBIDDEN, "ROLE_UNAUTHORIZED", ex.getMessage()));
    }

    private static String toSnakeCase(String field) {
        return field.replaceAll("([a-z])([A-Z]+)", "$1_$2").toLowerCase();
    }
}
