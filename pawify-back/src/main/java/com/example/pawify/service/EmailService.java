package com.example.pawify.service;

public interface EmailService {
    void sendRecoveryCodeToEmail(String email, String recoveryCode);
}
