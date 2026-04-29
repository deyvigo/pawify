package com.example.pawify.exception;

public class InvalidRecoveryCodeException extends RuntimeException {
    public InvalidRecoveryCodeException(String message) {
        super(message);
    }
}
