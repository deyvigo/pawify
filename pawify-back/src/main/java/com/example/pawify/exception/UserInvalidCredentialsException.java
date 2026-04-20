package com.example.pawify.exception;

public class UserInvalidCredentialsException extends RuntimeException {
    public UserInvalidCredentialsException(String message) {
        super(message);
    }
}
