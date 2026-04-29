package com.example.pawify.exception;

public class CredentialsAlreadyInUseException extends RuntimeException {
    public CredentialsAlreadyInUseException(String message) {
        super(message);
    }
}
